from pydantic import BaseModel


class RiskZoneBase(BaseModel):
    latitude: float
    longitude: float
    risk_score: float


class RiskZoneCreate(RiskZoneBase):
    pass


class RiskZoneRead(RiskZoneBase):
    zone_id: int

    class Config:
        from_attributes = True