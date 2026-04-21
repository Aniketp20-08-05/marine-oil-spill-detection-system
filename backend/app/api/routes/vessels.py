from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.vessel import VesselRead
from app.services.ais.ais_ingestion_service import AISIngestionService

router = APIRouter(prefix="/vessels", tags=["Vessels"])


@router.get("/", response_model=list[VesselRead])
def get_vessels(db: Session = Depends(get_db)):
    service = AISIngestionService(db)
    return service.get_all_vessels()