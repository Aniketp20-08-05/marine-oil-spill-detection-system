from datetime import datetime
from pydantic import BaseModel


class SatelliteImageBase(BaseModel):
    anomaly_id: int
    latitude: float
    longitude: float
    reason: str | None = None
    timestamp: datetime


class SatelliteImageCreate(SatelliteImageBase):
    pass


class SatelliteImageRead(SatelliteImageBase):
    image_id: int

    class Config:
        from_attributes = True