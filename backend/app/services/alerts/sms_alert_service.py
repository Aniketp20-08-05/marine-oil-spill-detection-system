from app.services.alerts.telegram_service import telegram_service

class SMSAlertService:
    """
    Service for sending alerts. 
    NOTE: This has been migrated from Twilio SMS to Telegram Bot.
    The method name is kept for backward compatibility with the pipeline.
    """
    def send_sms_alert(self, message: str, chat_id: str = None) -> dict:
        """
        Send an alert via Telegram.
        If chat_id is provided, sends to that chat.
        Otherwise, uses the default chat ID from settings.
        """
        return telegram_service.send_message(message, chat_id)