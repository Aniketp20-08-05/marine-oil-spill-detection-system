from __future__ import annotations
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.repositories.anomaly_repository import AnomalyRepository
from app.schemas.anomaly_event import AnomalyEventRead
from app.services.risk.drift_prediction_service import DriftPredictionService

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@router.get("/count")
def get_anomaly_count(db: Session = Depends(get_db)):
    """Return total number of anomalies in DB (for stats bar)."""
    repo = AnomalyRepository(db)
    return {"count": repo.get_count()}


@router.get("/", response_model=List[AnomalyEventRead])
def get_anomalies(
    limit: int = Query(default=50, le=500, description="Max number of anomalies to return"),
    db: Session = Depends(get_db)
):
    """Get latest anomalies, ordered by most recent first."""
    repo = AnomalyRepository(db)
    return repo.get_latest(limit=limit)


@router.get("/{anomaly_id}/drift")
def get_drift_prediction(
    anomaly_id: int,
    hours: int = Query(default=24, le=72, description="Number of hours to predict"),
    db: Session = Depends(get_db)
):
    """Predict the drift path of a potential oil spill from an anomaly."""
    repo = AnomalyRepository(db)
    anomaly = repo.get_by_id(anomaly_id)
    
    if not anomaly:
        raise HTTPException(status_code=404, detail="Anomaly not found")
    
    if not anomaly.vessel:
        raise HTTPException(status_code=400, detail="No vessel associated with this anomaly")

    service = DriftPredictionService()
    prediction = service.predict_drift(
        start_lat=anomaly.vessel.latitude,
        start_lon=anomaly.vessel.longitude,
        hours=hours
    )
    
    return {
        "anomaly_id": anomaly_id,
        "origin": {
            "latitude": anomaly.vessel.latitude,
            "longitude": anomaly.vessel.longitude
        },
        "prediction_path": prediction
    }