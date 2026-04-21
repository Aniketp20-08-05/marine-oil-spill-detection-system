from sqlalchemy import inspect

from app.db.session import engine

EXPECTED_TABLES = [
    "vessels",
    "ais_records",
    "anomaly_events",
    "satellite_images",
    "spill_detections",
    "risk_zones",
    "alerts",
    "response_actions",
]


def main():
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print("Tables found in database:")
    for table in tables:
        print(f"- {table}")

    print("\nVerification result:")
    missing = [table for table in EXPECTED_TABLES if table not in tables]

    if not missing:
        print("All expected tables are present.")
    else:
        print("Missing tables:")
        for table in missing:
            print(f"- {table}")


if __name__ == "__main__":
    main()