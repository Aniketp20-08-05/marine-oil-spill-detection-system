from fastapi import FastAPI
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from app.core.logging_config import setup_logging
from app.api.routes import vessels, anomalies, risk_zones, alerts, actions, pipeline, health, teams
from app.db.session import Base, engine
from app.db import base  # noqa: F401


setup_logging()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


import asyncio
from app.services.system_pipeline import SystemPipeline
from app.db.session import SessionLocal

async def run_periodic_monitoring():
    """Background task to run monitoring every 10 minutes"""
    print("Background monitoring task started (10 min window).")
    while True:
        try:
            print(f"[{datetime.now()}] Starting periodic risk check...")
            db = SessionLocal()
            try:
                pipeline = SystemPipeline(db)
                # FIX: Remove asyncio.run() and just call the function since we are already in an async loop
                result = await pipeline.run_monitoring_pipeline()
                print(f"Periodic check complete: {result['total_vessels_processed']} vessels processed.")
            finally:
                db.close()
        except Exception as e:
            print(f"Error in periodic monitoring: {e}")
        
        await asyncio.sleep(600)  # 10 minutes

@app.on_event("startup")
async def on_startup():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
    # Start the periodic monitoring task
    asyncio.create_task(run_periodic_monitoring())


app.include_router(health.router)
app.include_router(vessels.router)
app.include_router(anomalies.router)
app.include_router(risk_zones.router)
app.include_router(alerts.router)
app.include_router(actions.router)
app.include_router(teams.router)
app.include_router(pipeline.router)


@app.get("/")
def root():
    return {"message": "Marine Oil Spill Detection Backend Running"}