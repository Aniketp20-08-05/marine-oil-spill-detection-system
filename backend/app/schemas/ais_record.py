from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AISRecordBase(BaseModel):
    vessel_id: int
    latitude: float
    longitude: float
    sog: Optional[float] = None
    cog: Optional[float] = None
    timestamp: datetime


class AISRecordCreate(AISRecordBase):
    pass


class AISRecordRead(AISRecordBase):
    record_id: int

    class Config:
        from_attributes = True