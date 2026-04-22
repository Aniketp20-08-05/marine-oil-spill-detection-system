from datetime import datetime
from pydantic import BaseModel


class ResponseActionBase(BaseModel):
    alert_id: int
    action_type: str
    status: str = "pending"
    description: str | None = None
    triggered_by: str = "system"


class ResponseActionCreate(ResponseActionBase):
    pass


class ResponseActionRead(ResponseActionBase):
    action_id: int
    timestamp: datetime

    class Config:
        from_attributes = True