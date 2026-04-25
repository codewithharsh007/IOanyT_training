from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class City(BaseModel):
    displayName: str
    countryCode: Optional[str]


class CurrentWeather(BaseModel):
    observationTimeUtc: datetime   # ✅ changed from int → datetime
    temperatureC: float
    condition: str
    humidityPercent: int


class ForecastDay(BaseModel):
    date: str
    minTempC: float
    maxTempC: float
    expectedCondition: str
    expectedHumidityPercent: Optional[int]


class Metadata(BaseModel):
    cacheHit: bool
    stale: bool
    sourceProvider: str
    dataTimestamp: datetime   # ✅ also improved


class WeatherResponse(BaseModel):
    requestId: str
    city: City
    current: CurrentWeather
    forecast: List[ForecastDay]
    metadata: Metadata