from __future__ import annotations
from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, Request
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.repositories.anomaly_repository import AnomalyRepository
from app.schemas.anomaly_event import AnomalyEventRead
from app.services.risk.drift_prediction_service import DriftPredictionService

import logging
import io
import requests
from fastapi.responses import StreamingResponse, RedirectResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@router.get("/count")
def get_anomaly_count(db: Session = Depends(get_db)):
    """Return total number of anomalies in DB (for stats bar)."""
    repo = AnomalyRepository(db)
    return {"count": repo.get_count()}


@router.get("/", response_model=List[AnomalyEventRead])
def get_anomalies(
    request: Request,
    limit: int = Query(default=50, le=500, description="Max number of anomalies to return"),
    db: Session = Depends(get_db)
):
    """Get latest anomalies, ordered by most recent first."""
    repo = AnomalyRepository(db)
    anomalies = repo.get_latest(limit=limit)
    
    base_url = str(request.base_url).rstrip('/')
    
    result = []
    for a in anomalies:
        read_model = AnomalyEventRead.from_orm(a)
        if read_model.satellite_link:
            read_model.satellite_link = f"{base_url}/anomalies/{a.anomaly_id}/image"
        result.append(read_model)
        
    return result


@router.get("/{anomaly_id}/image")
def get_anomaly_image(anomaly_id: int, db: Session = Depends(get_db)):
    """Fetch the satellite image from Planet API and stream it, or redirect to a stable fallback."""
    repo = AnomalyRepository(db)
    anomaly = repo.get_by_id(anomaly_id)
    
    fallback_url = "https://upload.wikimedia.org/wikipedia/commons/f/f9/Oil_spill_from_Montara_offshore_oil_platform_in_the_Timor_Sea_-_radar_image_by_TerraSAR-X.jpg"
    
    if not anomaly or not anomaly.satellite_link:
        return RedirectResponse(fallback_url)
        
    # If it is the mock tiles URL, redirect to the stable fallback immediately
    if "tiles.planet.com" in anomaly.satellite_link:
        return RedirectResponse(fallback_url)
        
    # Fetch from Planet API using the API key
    if "api.planet.com" in anomaly.satellite_link:
        from app.core.config import settings
        api_key = settings.planet_api_key
        if not api_key:
            logger.warning("Planet API key not configured. Redirecting to fallback image.")
            return RedirectResponse(fallback_url)
            
        try:
            response = requests.get(
                anomaly.satellite_link,
                auth=(api_key, ""),
                timeout=10
            )
            if response.status_code == 200:
                return StreamingResponse(io.BytesIO(response.content), media_type="image/png")
            else:
                logger.error(f"Failed to fetch image from Planet API (Status {response.status_code}): {response.text}")
        except Exception as e:
            logger.error(f"Error fetching from Planet API: {str(e)}")
            
    return RedirectResponse(fallback_url)


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