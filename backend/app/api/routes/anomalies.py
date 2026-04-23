from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.repositories.anomaly_repository import AnomalyRepository
from app.schemas.anomaly_event import AnomalyEventRead

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@router.get("/count")
def get_anomaly_count(db: Session = Depends(get_db)):
    """Return total number of anomalies in DB (for stats bar)."""
    repo = AnomalyRepository(db)
    return {"count": repo.get_count()}


@router.get("/", response_model=list[AnomalyEventRead])
def get_anomalies(
    limit: int = Query(default=50, le=500, description="Max number of anomalies to return"),
    db: Session = Depends(get_db)
):
    """Get latest anomalies, ordered by most recent first."""
    repo = AnomalyRepository(db)
    return repo.get_latest(limit=limit)