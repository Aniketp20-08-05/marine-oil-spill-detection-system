def validate_api_key(api_key: str | None) -> bool:
    if not api_key:
        return False
    return True