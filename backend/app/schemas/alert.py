from datetime import datetime
from pydantic import BaseModel


class AlertBase(BaseModel):
    risk_zone_id: int
    message: str
    status: str
    timestamp: datetime


class AlertCreate(AlertBase):
    pass


class AlertRead(AlertBase):
    alert_id: int

    class Config:
        from_attributes = True