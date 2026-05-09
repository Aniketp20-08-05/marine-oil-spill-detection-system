from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ResponseActionBase(BaseModel):
    alert_id: int
    action_type: str
    status: str = "pending"
    description: Optional[str] = None
    triggered_by: str = "system"


class ResponseActionCreate(ResponseActionBase):
    pass


class ResponseActionRead(ResponseActionBase):
    action_id: int
    timestamp: datetime

    class Config:
        from_attributes = True