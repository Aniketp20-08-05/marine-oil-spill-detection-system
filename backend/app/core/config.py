from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Marine Oil Spill Detection System"
    app_version: str = "0.1.0"
    debug: bool = True

    api_prefix: str = "/api"

    database_url: str = "sqlite:///./marine.db"

    cors_origins: list[str] = ["*"]

    aisstream_api_key: str = ""
    planet_api_key: str = ""
    planet_user_id: str = ""

    # Telegram Configuration
    telegram_bot_token: str = ""
    telegram_chat_id: str = ""
    enable_telegram: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()