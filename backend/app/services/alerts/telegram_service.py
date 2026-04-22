import logging
import requests
from app.core.config import settings

logger = logging.getLogger(__name__)


class TelegramService:
    """Service for sending notifications via Telegram Bot API"""

    def __init__(self):
        self.enabled = settings.enable_telegram
        self.token = settings.telegram_bot_token
        self.default_chat_id = settings.telegram_chat_id
        
        if self.enabled and not self.token:
            logger.warning("Telegram service enabled but no bot token provided")
            self.enabled = False

    def send_message(self, message: str, chat_id: str = None) -> dict:
        """
        Send message to a Telegram chat.
        
        Args:
            message: Message content (supports HTML)
            chat_id: Target chat ID (falls back to default if not provided)
        """
        target_chat = chat_id or self.default_chat_id
        
        if not self.enabled:
            logger.warning(f"TELEGRAM SIMULATION: Would send to {target_chat}: {message[:100]}...")
            return {
                "success": False,
                "status": "simulated",
                "reason": "Telegram service disabled or not configured",
                "message": message
            }

        if not target_chat:
            logger.error("No chat_id provided for Telegram notification")
            return {
                "success": False,
                "status": "failed",
                "reason": "No chat_id provided"
            }

        try:
            url = f"https://api.telegram.org/bot{self.token}/sendMessage"
            payload = {
                "chat_id": target_chat,
                "text": message,
                "parse_mode": "HTML"
            }
            
            response = requests.post(url, data=payload, timeout=10)
            result = response.json()
            
            if response.status_code == 200 and result.get("ok"):
                logger.info(f"Telegram message sent successfully to {target_chat}")
                return {
                    "success": True,
                    "status": "sent",
                    "message_id": result["result"]["message_id"]
                }
            else:
                error_msg = result.get("description", "Unknown error")
                logger.error(f"Failed to send Telegram message: {error_msg}")
                return {
                    "success": False,
                    "status": "failed",
                    "reason": error_msg
                }

        except Exception as e:
            logger.error(f"Error sending Telegram notification: {str(e)}")
            return {
                "success": False,
                "status": "failed",
                "reason": str(e)
            }


# Global Telegram service instance
telegram_service = TelegramService()
