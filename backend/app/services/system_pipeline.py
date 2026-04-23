from datetime import datetime, timedelta
from app.models.alert import Alert
from app.models.risk_zone import RiskZone
from app.repositories.alert_repository import AlertRepository
from app.repositories.risk_zone_repository import RiskZoneRepository
from app.services.ais.ais_ingestion_service import AISIngestionService
from app.services.anomaly.anomaly_detection_service import AnomalyDetectionService
from app.services.satellite.satellite_fetch_service import SatelliteFetchService
from app.services.image_processing.spill_detection_service import SpillDetectionService
from app.services.risk.risk_score_service import RiskScoreService
from app.services.alerts.alert_dispatcher import build_alert_message
from app.services.alerts.sms_alert_service import SMSAlertService


class SystemPipeline:
    def __init__(self, db):
        self.db = db
        self.ais_service = AISIngestionService(db)
        self.anomaly_service = AnomalyDetectionService(db)
        self.satellite_service = SatelliteFetchService()
        self.spill_service = SpillDetectionService()
        self.risk_service = RiskScoreService()
        self.alert_service = SMSAlertService()
        self.risk_zone_repository = RiskZoneRepository(db)
        self.alert_repository = AlertRepository(db)

    async def run_monitoring_pipeline(self) -> dict:
        vessels = await self.ais_service.sync_vessels_and_records()
        processed_results = []

        for vessel in vessels:
            anomaly_result = self.anomaly_service.detect_anomaly(vessel)

            if not anomaly_result["anomaly_detected"]:
                processed_results.append(
                    {
                        "vessel": vessel,
                        "status": "normal",
                        "anomaly": anomaly_result,
                    }
                )
                continue

            self.anomaly_service.store_anomaly(vessel["vessel_id"], anomaly_result)

            satellite_result = self.satellite_service.fetch_satellite_image(
                latitude=vessel["latitude"],
                longitude=vessel["longitude"],
                anomaly_score=anomaly_result["anomaly_score"],
            )

            spill_result = self.spill_service.process_spill_image(
                image_data=satellite_result,
                vessel_data=vessel,
                anomaly_result=anomaly_result,
            )

            if not spill_result["spill_detected"]:
                processed_results.append(
                    {
                        "vessel": vessel,
                        "status": "anomaly_only",
                        "anomaly": anomaly_result,
                        "satellite": satellite_result,
                        "spill": spill_result,
                    }
                )
                continue

            risk_result = self.risk_service.calculate_risk_score(
                anomaly_score=anomaly_result["anomaly_score"],
                confidence_score=spill_result["confidence_score"],
            )

            risk_zone = RiskZone(
                latitude=vessel["latitude"],
                longitude=vessel["longitude"],
                risk_score=risk_result["risk_score"],
            )
            risk_zone = self.risk_zone_repository.create(risk_zone)

            # 6. Build Alert Message
            alert_message = build_alert_message(vessel, risk_result)

            # 7. Check for duplicate alerts (cooldown: 5 minutes)
            recent_alert = self.db.query(Alert).filter(
                Alert.message.like(f"%IMO: {vessel['imo_number']}%"),
                Alert.timestamp >= datetime.utcnow() - timedelta(minutes=5)
            ).first()

            if recent_alert:
                alert_delivery = {"status": "skipped (duplicate)", "message": "Alert already sent recently."}
            else:
                alert_delivery = self.alert_service.send_sms_alert(alert_message)

            # 8. Store Alert in DB
            alert = Alert(
                risk_zone_id=risk_zone.zone_id,
                message=alert_message,
                status=alert_delivery["status"],
            )
            alert = self.alert_repository.create(alert)

            processed_results.append(
                {
                    "vessel": vessel,
                    "status": "alert_generated",
                    "anomaly": anomaly_result,
                    "satellite": satellite_result,
                    "spill": spill_result,
                    "risk": risk_result,
                    "alert": {
                        "alert_id": alert.alert_id,
                        "status": alert.status,
                        "message": alert.message,
                    },
                }
            )

        return {
            "message": "Core monitoring pipeline executed successfully.",
            "total_vessels_processed": len(processed_results),
            "results": processed_results,
        }