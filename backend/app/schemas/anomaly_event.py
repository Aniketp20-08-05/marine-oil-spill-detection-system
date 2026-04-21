from datetime import datetime
from pydantic import BaseModel


class AnomalyEventBase(BaseModel):
    vessel_id: int
    anomaly_score: float
    reason: str
    timestamp: datetime


class AnomalyEventCreate(AnomalyEventBase):
    pass


class AnomalyEventRead(AnomalyEventBase):
    anomaly_id: int

    class Config:
        from_attributes = True