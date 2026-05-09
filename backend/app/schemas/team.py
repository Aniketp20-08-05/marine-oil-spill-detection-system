from pydantic import BaseModel
from typing import Optional


class TeamBase(BaseModel):
    name: str
    telegram_chat_id: Optional[str] = None
    email: Optional[str] = None
    contact_person: Optional[str] = None
    location: Optional[str] = None
    is_active: str = "active"


class TeamCreate(TeamBase):
    pass


class TeamRead(TeamBase):
    team_id: int

    class Config:
        from_attributes = True


class TeamNotificationRead(BaseModel):
    notification_id: int
    action_id: int
    team_id: int
    message: str
    status: str
    delivery_method: str

    class Config:
        from_attributes = True
