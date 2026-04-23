from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.system_pipeline import SystemPipeline

router = APIRouter(prefix="/pipeline", tags=["Pipeline"])


@router.get("/run")
async def run_pipeline(db: Session = Depends(get_db)):
    pipeline = SystemPipeline(db)
    return await pipeline.run_monitoring_pipeline()