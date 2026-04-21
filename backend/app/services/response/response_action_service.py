class ResponseActionService:
    def trigger_response_action(self, action_type: str) -> dict:
        return {
            "status": "success",
            "action": action_type,
            "message": f"{action_type} triggered successfully",
        }