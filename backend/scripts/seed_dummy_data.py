from app.db.session import SessionLocal
from app.models.vessel import Vessel


def seed_vessels():
    db = SessionLocal()

    existing = db.query(Vessel).first()
    if existing:
        print("Dummy data already exists.")
        db.close()
        return

    vessels = [
        Vessel(
            name="MV Samudra Devi",
            imo_number="9412847",
            type="Tanker",
            latitude=19.0760,
            longitude=72.8777,
            sog=0.4,
            cog=214,
            heading=215,
            destination="Mumbai JNPT",
        ),
        Vessel(
            name="MT Kaveri",
            imo_number="9300012",
            type="Chemical",
            latitude=18.9500,
            longitude=72.8100,
            sog=2.1,
            cog=175,
            heading=174,
            destination="Offshore Holding",
        ),
        Vessel(
            name="MV Vikram",
            imo_number="9501134",
            type="Cargo",
            latitude=19.2500,
            longitude=72.9500,
            sog=10.8,
            cog=140,
            heading=139,
            destination="Hazira Port",
        ),
        Vessel(
            name="FV Sagari",
            imo_number="8822133",
            type="Fishing",
            latitude=18.7800,
            longitude=72.6500,
            sog=4.0,
            cog=90,
            heading=91,
            destination="Local Waters",
        ),
    ]

    db.add_all(vessels)
    db.commit()
    db.close()
    print("Dummy vessel data inserted successfully.")


if __name__ == "__main__":
    seed_vessels()