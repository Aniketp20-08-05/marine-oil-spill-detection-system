from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class VesselSummary(BaseModel):
    vessel_id: int
    name: str
    type: str

    class Config:
        from_attributes = True


class AnomalyEventBase(BaseModel):
    vessel_id: int
    anomaly_score: float
    reason: str
    timestamp: datetime


class AnomalyEventCreate(AnomalyEventBase):
    pass


class AnomalyEventRead(AnomalyEventBase):
    anomaly_id: int
    vessel: Optional[VesselSummary] = None

    class Config:
        from_attributes = True