from app.services.provider import fetch_weather
from app.services.cache import get_cache, set_cache
from app.utils import normalize_city
import os
import uuid
from collections import defaultdict
import time
from datetime import datetime

CACHE_TTL = int(os.getenv("CACHE_TTL", 1800))
STALE_TTL = int(os.getenv("STALE_TTL", 21600))


def process_forecast(data):
    grouped = defaultdict(list)

    for item in data["list"]:
        date = item["dt_txt"].split(" ")[0]
        grouped[date].append(item)

    sorted_dates = sorted(grouped.keys())

    result = []
    for date in sorted_dates[:3]:
        items = grouped[date]

        temps = [i["main"]["temp"] for i in items]
        humidity = [i["main"]["humidity"] for i in items]
        conditions = [i["weather"][0]["main"] for i in items]

        result.append({
            "date": date,
            "minTempC": min(temps),
            "maxTempC": max(temps),
            "expectedCondition": max(set(conditions), key=conditions.count),
            "expectedHumidityPercent": int(sum(humidity) / len(humidity))
        })

    return result


def get_weather(city):
    request_id = str(uuid.uuid4())
    norm_city = normalize_city(city)
    cache_key = f"weather:{norm_city}"

    cached, is_stale = get_cache(cache_key)

    if cached and not is_stale:
        return cached["data"], {
            "requestId": request_id,
            "cacheHit": True,
            "stale": False,
            "dataTimestamp": datetime.utcfromtimestamp(cached["timestamp"]),
            "sourceProvider": "cache"
        }

    provider_data = fetch_weather(city)

    if provider_data == "CITY_NOT_FOUND":
        return "NOT_FOUND", {"requestId": request_id}

    if provider_data:
        current = provider_data["current"]
        forecast = provider_data["forecast"]

        response = {
            "city": {
                "displayName": current["name"],
                "countryCode": current["sys"].get("country")
            },
            "current": {
                # ✅ FIXED HERE
                "observationTimeUtc": datetime.utcfromtimestamp(current["dt"]),
                "temperatureC": current["main"]["temp"],
                "condition": current["weather"][0]["main"],
                "humidityPercent": current["main"]["humidity"]
            },
            "forecast": process_forecast(forecast)
        }

        set_cache(cache_key, response, CACHE_TTL, STALE_TTL)

        return response, {
            "requestId": request_id,
            "cacheHit": False,
            "stale": False,
            "dataTimestamp": datetime.utcnow(),
            "sourceProvider": "openweather"
        }

    # fallback to stale
    if cached:
        return cached["data"], {
            "requestId": request_id,
            "cacheHit": True,
            "stale": True,
            "dataTimestamp": datetime.utcfromtimestamp(cached["timestamp"]),
            "sourceProvider": "cache"
        }

    return None, {"requestId": request_id}