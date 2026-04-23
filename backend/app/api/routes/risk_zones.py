from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.api.dependencies import get_db
from app.repositories.risk_zone_repository import RiskZoneRepository
from app.schemas.risk_zone import RiskZoneRead

router = APIRouter(prefix="/risk-zones", tags=["Risk Zones"])


@router.get("/", response_model=list[RiskZoneRead])
def get_risk_zones(
    limit: int = Query(default=20, le=100, description="Max number of risk zones to return"),
    db: Session = Depends(get_db)
):
    """Get latest risk zones, ordered by most recent first."""
    repo = RiskZoneRepository(db)
    zones = repo.get_latest(limit=limit)
    return zones