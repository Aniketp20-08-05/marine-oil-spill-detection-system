from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.repositories.alert_repository import AlertRepository
from app.schemas.alert import AlertRead

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/", response_model=list[AlertRead])
def get_alerts(db: Session = Depends(get_db)):
    repo = AlertRepository(db)
    alerts = repo.get_all()
    # Sort by ID descending to get latest first
    return sorted(alerts, key=lambda x: x.alert_id, reverse=True)