import asyncio
import json
import websockets
from app.models.ais_record import AISRecord
from app.repositories.ais_record_repository import AISRecordRepository
from app.repositories.vessel_repository import VesselRepository


class AISIngestionService:
    def __init__(self, db):
        self.db = db
        self.vessel_repository = VesselRepository(db)
        self.ais_record_repository = AISRecordRepository(db)

    def fetch_ais_data(self) -> list[dict]:
        return asyncio.run(self._fetch_ais_stream())

    async def _fetch_ais_stream(self) -> list[dict]:
        from app.core.config import settings
        api_key = settings.aisstream_api_key
        if not api_key:
            print("Warning: No AISStream API key configured. Returning mock data.")
            return self._mock_ais_data()

        print("Connecting to AIS stream...")
        url = "wss://stream.aisstream.io/v0/stream"
        subscription = {
            "APIKey": api_key,
            "BoundingBoxes": [[[-90, -180], [90, 180]]],
            "FilterMessageTypes": ["PositionReport"]
        }

        vessels = []
        try:
            async with websockets.connect(url) as websocket:
                await websocket.send(json.dumps(subscription))
                
                # Fetch up to 5 vessels per pipeline run
                for _ in range(5):
                    message_str = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    message = json.loads(message_str)
                    
                    print("Received a message")
                    if message.get("MessageType") == "PositionReport":
                        report = message["Message"]["PositionReport"]
                        print(f"Added vessel {report.get('UserID')}")
                        vessels.append({
                            "name": f"Vessel_{report['UserID']}",
                            "imo_number": str(report.get("UserID", "")),
                            "type": "Unknown",
                            "latitude": report["Latitude"],
                            "longitude": report["Longitude"],
                            "sog": report.get("Sog", 0.0),
                            "cog": report.get("Cog", 0.0),
                            "heading": report.get("TrueHeading", 0.0),
                            "destination": "Unknown",
                        })
        except asyncio.TimeoutError:
            print("AISStream fetch timed out.")
        except Exception as e:
            print(f"Error fetching from AISStream: {e}")

        print(f"Returning {len(vessels)} vessels from stream")
        return vessels if vessels else self._mock_ais_data()

    def _mock_ais_data(self) -> list[dict]:
        return [
            {
                "name": "MV Samudra Devi",
                "imo_number": "9412847",
                "type": "Tanker",
                "latitude": 19.0760,
                "longitude": 72.8777,
                "sog": 0.4,
                "cog": 214,
                "heading": 215,
                "destination": "Mumbai JNPT",
            },
            {
                "name": "MT Kaveri",
                "imo_number": "9300012",
                "type": "Chemical",
                "latitude": 18.9500,
                "longitude": 72.8100,
                "sog": 1.1,
                "cog": 175,
                "heading": 174,
                "destination": "Offshore Holding",
            },
            {
                "name": "MV Vikram",
                "imo_number": "9501134",
                "type": "Cargo",
                "latitude": 19.2500,
                "longitude": 72.9500,
                "sog": 10.8,
                "cog": 140,
                "heading": 139,
                "destination": "Hazira Port",
            },
            {
                "name": "FV Sagari",
                "imo_number": "8822133",
                "type": "Fishing",
                "latitude": 18.7800,
                "longitude": 72.6500,
                "sog": 3.2,
                "cog": 310,
                "heading": 308,
                "destination": "Local Waters",
            },
        ]

    def sync_vessels_and_records(self) -> list[dict]:
        results = []

        for payload in self.fetch_ais_data():
            vessel = self.vessel_repository.upsert_from_ais(payload)

            ais_record = AISRecord(
                vessel_id=vessel.vessel_id,
                latitude=payload["latitude"],
                longitude=payload["longitude"],
                sog=payload.get("sog"),
                cog=payload.get("cog"),
            )
            self.ais_record_repository.create(ais_record)

            results.append(
                {
                    "vessel_id": vessel.vessel_id,
                    "name": vessel.name,
                    "imo_number": vessel.imo_number,
                    "type": vessel.type,
                    "latitude": vessel.latitude,
                    "longitude": vessel.longitude,
                    "sog": vessel.sog,
                    "cog": vessel.cog,
                    "heading": vessel.heading,
                    "destination": vessel.destination,
                }
            )

        return results

    def get_all_vessels(self):
        return self.vessel_repository.get_all()