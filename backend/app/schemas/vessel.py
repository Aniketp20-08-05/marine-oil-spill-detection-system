from pydantic import BaseModel
from typing import Optional


class VesselBase(BaseModel):
    name: str
    imo_number: str
    type: str
    latitude: float
    longitude: float
    sog: Optional[float] = None
    cog: Optional[float] = None
    heading: Optional[float] = None
    destination: Optional[str] = None


class VesselCreate(VesselBase):
    pass


class VesselRead(VesselBase):
    vessel_id: int

    class Config:
        from_attributes = True