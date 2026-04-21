from datetime import datetime
from pydantic import BaseModel


class AISRecordBase(BaseModel):
    vessel_id: int
    latitude: float
    longitude: float
    sog: float | None = None
    cog: float | None = None
    timestamp: datetime


class AISRecordCreate(AISRecordBase):
    pass


class AISRecordRead(AISRecordBase):
    record_id: int

    class Config:
        from_attributes = True