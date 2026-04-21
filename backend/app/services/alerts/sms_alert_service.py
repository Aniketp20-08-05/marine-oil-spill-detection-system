class SMSAlertService:
    def send_sms_alert(self, message: str) -> dict:
        return {
            "status": "sent",
            "message": message,
        }