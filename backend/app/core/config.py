from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Marine Oil Spill Detection System"
    app_version: str = "0.1.0"
    debug: bool = True

    api_prefix: str = "/api"

    database_url: str = "sqlite:///./marine.db"

    cors_origins: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()