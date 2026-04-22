import logging
from sqlalchemy.orm import Session

from app.models.team import Team
from app.repositories.team_repository import TeamRepository, TeamNotificationRepository
from app.services.alerts.telegram_service import telegram_service

logger = logging.getLogger(__name__)


# Action type to team name mapping
ACTION_TO_TEAMS = {
    "Dispatch Coast Guard": ["Coast Guard"],
    "Mobilize Oil Boom Team": ["Oil Boom Team"],
    "Initiate Wildlife Response": ["Wildlife Response Team"],
    "Dispatch Inventory": ["Inventory Team"],
}

# Team notification templates
NOTIFICATION_TEMPLATES = {
    "Dispatch Coast Guard": "🚨 <b>COAST GUARD ALERT</b>: Oil spill incident detected. Immediate action required. Check dashboard for details.",
    "Mobilize Oil Boom Team": "🚨 <b>OIL BOOM ALERT</b>: Oil spill containment operation initiated. Deploy boom equipment immediately.",
    "Initiate Wildlife Response": "🚨 <b>WILDLIFE ALERT</b>: Marine wildlife rescue needed. Prepare evacuation and care procedures.",
    "Dispatch Inventory": "🚨 <b>INVENTORY ALERT</b>: Emergency supplies required for spill response. Stage equipment for deployment.",
}


class TeamNotificationService:
    def __init__(self, db: Session):
        self.db = db
        self.team_repo = TeamRepository(db)
        self.notification_repo = TeamNotificationRepository(db)

    def notify_teams_for_action(
        self, action_id: int, action_type: str, alert_id: int = None
    ) -> list[dict]:
        """
        Notify relevant teams based on the response action type.
        Sends Telegram alerts to team contacts with incident details.
        """
        notifications_sent = []
        
        # 1. Fetch Alert details to enrich the notification
        alert_details = ""
        if alert_id:
            from app.models.alert import Alert
            alert = self.db.query(Alert).filter(Alert.alert_id == alert_id).first()
            if alert:
                alert_details = f"\n\n📍 <b>Incident Details</b>:\n{alert.message}"

        # 2. Get team names and base message template
        team_names = ACTION_TO_TEAMS.get(action_type, [])
        base_message = NOTIFICATION_TEMPLATES.get(
            action_type, f"Response action triggered: {action_type}"
        )
        
        # 3. Combine for a rich message
        full_message = f"{base_message}{alert_details}"

        for team_name in team_names:
            team = self.team_repo.get_by_name(team_name)
            if team:
                # Create notification record
                notification = self.notification_repo.create(
                    action_id=action_id,
                    team_id=team.team_id,
                    message=full_message,
                    delivery_method=self._get_delivery_method(team),
                )

                # Send actual notification (Telegram)
                result = self._send_notification(team, full_message)

                notifications_sent.append(
                    {
                        "team_id": team.team_id,
                        "team_name": team.name,
                        "status": "sent" if result.get("success") else "failed",
                        "method": self._get_delivery_method(team),
                        "recipient": self._get_recipient(team),
                        "delivery_info": result.get("message", result.get("reason", "Unknown")),
                    }
                )

        return notifications_sent

    def _get_delivery_method(self, team) -> str:
        """Determine best delivery method for team"""
        if team.telegram_chat_id:
            return "telegram"
        elif team.email:
            return "email"
        return "push"

    def _get_recipient(self, team) -> str:
        """Get recipient address/ID"""
        if team.telegram_chat_id:
            return f"Telegram:{team.telegram_chat_id}"
        elif team.email:
            return team.email
        return team.name

    def _send_notification(self, team, message: str) -> dict:
        """
        Send actual notification to team.
        Currently supports Telegram notifications.
        """
        recipient = self._get_recipient(team)
        method = self._get_delivery_method(team)

        if method == "telegram" and team.telegram_chat_id:
            # Send via Telegram
            print(f"DEBUG: Sending Telegram message to {team.telegram_chat_id}...")
            result = telegram_service.send_message(message, team.telegram_chat_id)
            print(f"DEBUG: Telegram result: {result}")
            logger.info(
                f"Telegram notification - Team: {team.name}, ChatID: {team.telegram_chat_id}, Status: {result.get('status')}"
            )
            return result

        elif method == "email":
            # TODO: Integrate with SendGrid or AWS SES
            logger.info(
                f"[EMAIL] Sending to {team.name} ({recipient}): {message[:100]}..."
            )
            return {"success": True, "status": "simulated"}

        else:
            # Fallback: log the notification
            logger.info(
                f"[{method.upper()}] Sending to {team.name} ({recipient}): {message[:100]}..."
            )
            return {"success": True, "status": "logged"}
