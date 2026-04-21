from datetime import datetime
from pydantic import BaseModel


class ResponseActionBase(BaseModel):
    alert_id: int
    action_type: str
    timestamp: datetime


class ResponseActionCreate(ResponseActionBase):
    pass


class ResponseActionRead(ResponseActionBase):
    action_id: int

    class Config:
        from_attributes = True