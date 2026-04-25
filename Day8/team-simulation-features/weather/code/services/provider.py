import requests
import os

API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"


def fetch_weather(city):
    try:
        current_url = f"{BASE_URL}/weather?q={city}&appid={API_KEY}&units=metric"
        forecast_url = f"{BASE_URL}/forecast?q={city}&appid={API_KEY}&units=metric"

        current_res = requests.get(current_url, timeout=3)

        if current_res.status_code == 404:
            return "CITY_NOT_FOUND"

        if current_res.status_code != 200:
            return None

        forecast_res = requests.get(forecast_url, timeout=3)

        if forecast_res.status_code != 200:
            return None

        return {
            "current": current_res.json(),
            "forecast": forecast_res.json()
        }

    except Exception:
        return None