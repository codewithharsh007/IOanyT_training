from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import get_weather
from app.utils import validate_city
from app.models import WeatherResponse

router = APIRouter()


@router.get("/weather", response_model=WeatherResponse)
def weather(city: str = Query(...)):
    
    if not validate_city(city):
        raise HTTPException(status_code=400, detail="Invalid city format")

    data, meta = get_weather(city)

    if data == "NOT_FOUND":
        raise HTTPException(status_code=404, detail="City not found")

    if data is None:
        raise HTTPException(status_code=503, detail="Weather service unavailable")

    return {
        "requestId": meta.get("requestId"),
        "city": data["city"],
        "current": data["current"],
        "forecast": data["forecast"],
        "metadata": {
            "cacheHit": meta.get("cacheHit"),
            "stale": meta.get("stale"),
            "sourceProvider": meta.get("sourceProvider"),
            "dataTimestamp": meta.get("dataTimestamp")
        }
    }


@router.get("/health")
def health():
    return {"status": "ok"}