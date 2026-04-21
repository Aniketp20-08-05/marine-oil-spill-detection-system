from sqlalchemy.orm import Session

from app.models.vessel import Vessel
from app.schemas.vessel import VesselCreate


class VesselRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Vessel]:
        return self.db.query(Vessel).all()

    def get_by_id(self, vessel_id: int) -> Vessel | None:
        return self.db.query(Vessel).filter(Vessel.vessel_id == vessel_id).first()

    def get_by_imo(self, imo_number: str) -> Vessel | None:
        return self.db.query(Vessel).filter(Vessel.imo_number == imo_number).first()

    def create(self, vessel_data: VesselCreate) -> Vessel:
        vessel = Vessel(**vessel_data.model_dump())
        self.db.add(vessel)
        self.db.commit()
        self.db.refresh(vessel)
        return vessel

    def upsert_from_ais(self, vessel_payload: dict) -> Vessel:
        vessel = self.get_by_imo(vessel_payload["imo_number"])

        if vessel:
            vessel.name = vessel_payload["name"]
            vessel.type = vessel_payload["type"]
            vessel.latitude = vessel_payload["latitude"]
            vessel.longitude = vessel_payload["longitude"]
            vessel.sog = vessel_payload.get("sog")
            vessel.cog = vessel_payload.get("cog")
            vessel.heading = vessel_payload.get("heading")
            vessel.destination = vessel_payload.get("destination")
        else:
            vessel = Vessel(
                name=vessel_payload["name"],
                imo_number=vessel_payload["imo_number"],
                type=vessel_payload["type"],
                latitude=vessel_payload["latitude"],
                longitude=vessel_payload["longitude"],
                sog=vessel_payload.get("sog"),
                cog=vessel_payload.get("cog"),
                heading=vessel_payload.get("heading"),
                destination=vessel_payload.get("destination"),
            )
            self.db.add(vessel)

        self.db.commit()
        self.db.refresh(vessel)
        return vessel