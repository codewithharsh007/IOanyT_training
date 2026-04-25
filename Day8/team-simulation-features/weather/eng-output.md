# 🌦️ Weather Data Aggregator API

A lightweight backend API that provides **current weather** and a **3-day forecast** for a given city, with built-in caching to reduce external API calls and improve performance.

---

## 🚀 Features

* Get **current weather** (temperature, condition, humidity)
* Get **3-day forecast** (min/max temp, condition, humidity)
* **Caching layer (30 min TTL)** to reduce API calls
* **Stale fallback (6 hours)** for reliability
* Input validation & error handling
* Standardized API response format
* Health check endpoint
* Built with FastAPI (high performance)

---

## 🛠️ Tech Stack

* **Framework:** FastAPI
* **Language:** Python
* **External API:** OpenWeatherMap
* **Caching:** In-memory (dictionary-based)
* **Environment Config:** python-dotenv

---

## 📁 Project Structure

```
weather_api/
│
├── app/
│   ├── main.py
│   ├── routes.py
│   ├── models.py
│   ├── utils.py
│   ├── services/
│   │   ├── weather_service.py
│   │   ├── provider.py
│   │   └── cache.py
│
├── .env
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd weather_api
```

---

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

Activate it:

* Windows:

```bash
venv\Scripts\activate
```

* Mac/Linux:

```bash
source venv/bin/activate
```

---

### 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file in root:

```env
OPENWEATHER_API_KEY=your_api_key_here
CACHE_TTL=1800
STALE_TTL=21600
```

👉 Get API key from OpenWeatherMap

---

### 5️⃣ Run the Server

```bash
uvicorn app.main:app --reload
```

---

## 🌐 API Endpoints

### 🔹 Get Weather

```
GET /api/v1/weather?city=Delhi
```

#### ✅ Success Response (200)

```json
{
  "requestId": "abc-123",
  "city": {
    "displayName": "Delhi",
    "countryCode": "IN"
  },
  "current": {
    "observationTimeUtc": "2026-04-23T10:00:00",
    "temperatureC": 32,
    "condition": "Clear",
    "humidityPercent": 45
  },
  "forecast": [
    {
      "date": "2026-04-24",
      "minTempC": 28,
      "maxTempC": 34,
      "expectedCondition": "Cloudy",
      "expectedHumidityPercent": 50
    }
  ],
  "metadata": {
    "cacheHit": false,
    "stale": false,
    "sourceProvider": "openweather",
    "dataTimestamp": "2026-04-23T10:05:00"
  }
}
```

---

### 🔹 Health Check

```
GET /api/v1/health
```

Response:

```json
{
  "status": "ok"
}
```

---

## ⚠️ Error Handling

| Status Code | Description           |
| ----------- | --------------------- |
| 400         | Invalid city input    |
| 404         | City not found        |
| 503         | External API failure  |
| 500         | Internal server error |

---

## 🧠 Caching Strategy

* **Cache Key:** `weather:{normalized_city}`
* **TTL:** 30 minutes
* **Stale Fallback:** Up to 6 hours
* Reduces API calls & improves performance

---

## 🧪 Testing the API

Open in browser or Postman:

```
http://127.0.0.1:8000/api/v1/weather?city=Delhi
```

Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## ⚠️ Known Limitations

* In-memory cache (not persistent)
* No authentication (MVP scope)
* No rate limiting
* No multi-city disambiguation
* Forecast limited to 3 days

---

## 🚀 Future Improvements

* Redis-based caching
* Async API calls (httpx)
* Rate limiting
* Country-based city disambiguation
* Docker deployment
* Logging & monitoring

---

## 👨‍💻 Author

Developed as part of backend system design & implementation practice.

---
