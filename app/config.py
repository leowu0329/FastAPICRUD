from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str
    mongodb_dbname: str
    app_secret_key: str
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()