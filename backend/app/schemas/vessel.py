from pydantic import BaseModel


class VesselBase(BaseModel):
    name: str
    imo_number: str
    type: str
    latitude: float
    longitude: float
    sog: float | None = None
    cog: float | None = None
    heading: float | None = None
    destination: str | None = None


class VesselCreate(VesselBase):
    pass


class VesselRead(VesselBase):
    vessel_id: int

    class Config:
        from_attributes = True