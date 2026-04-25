from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="Weather Aggregator API")

app.include_router(router, prefix="/api/v1")