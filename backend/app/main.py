from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.api.routes import vessels, anomalies, risk_zones, alerts, actions, pipeline, health
from app.db.session import Base, engine
from app.db import base  # noqa: F401


setup_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")


app.include_router(health.router)
app.include_router(vessels.router)
app.include_router(anomalies.router)
app.include_router(risk_zones.router)
app.include_router(alerts.router)
app.include_router(actions.router)
app.include_router(pipeline.router)


@app.get("/")
def root():
    return {"message": "Marine Oil Spill Detection Backend Running"}