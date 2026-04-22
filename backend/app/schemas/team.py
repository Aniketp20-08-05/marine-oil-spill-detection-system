from pydantic import BaseModel


class TeamBase(BaseModel):
    name: str
    telegram_chat_id: str | None = None
    email: str | None = None
    contact_person: str | None = None
    location: str | None = None
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
