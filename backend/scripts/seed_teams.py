"""
Script to seed default response teams into the database.
Run this after initializing the database.
"""

from sqlalchemy.orm import Session

from app.db.session import engine, SessionLocal
from app.models.team import Team
from app.db.base import Team as TeamModel


# Default teams (updated to use Telegram)
DEFAULT_TEAMS = [
    {
        "name": "Coast Guard",
        "telegram_chat_id": "",
        "email": "operations@uscg.mil",
        "contact_person": "Commander",
        "location": "Coastal Regions",
    },
    {
        "name": "Oil Boom Team",
        "telegram_chat_id": "",
        "email": "boom@oilresponse.com",
        "contact_person": "Team Lead",
        "location": "Spill Site",
    },
    {
        "name": "Wildlife Response Team",
        "telegram_chat_id": "",
        "email": "wildlife@rescue.org",
        "contact_person": "Veterinarian",
        "location": "Wildlife Center",
    },
    {
        "name": "Inventory Team",
        "telegram_chat_id": "",
        "email": "supplies@inventory.com",
        "contact_person": "Inventory Manager",
        "location": "Supply Warehouse",
    },
]


def seed_teams():
    """Create default teams if they don't exist"""
    db: Session = SessionLocal()

    try:
        for team_data in DEFAULT_TEAMS:
            # Check if team already exists
            existing = db.query(TeamModel).filter(TeamModel.name == team_data["name"]).first()
            if not existing:
                team = TeamModel(**team_data)
                db.add(team)
                print(f"✓ Created team: {team_data['name']}")
            else:
                # Update existing team to include telegram_chat_id field if needed
                # (SQLAlchemy will handle the schema change if using Alembic, but here we just update if it exists)
                print(f"✓ Team already exists: {team_data['name']}")

        db.commit()
        print("\n✓ All teams seeded successfully!")

    except Exception as e:
        print(f"✗ Error seeding teams: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_teams()
