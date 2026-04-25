# Feature 2: Weather Data Aggregator

## Client Request
"We want a simple dashboard API that takes a city name and returns current weather + a 3-day forecast. Use any free weather API. Cache results so we don't hit rate limits. Show temperature, conditions, and humidity."

## Technical Constraints
- Python (Flask or FastAPI)
- Use OpenWeatherMap free tier (or mock data if no API key)
- Cache responses for 30 minutes
- Must handle city-not-found gracefully
