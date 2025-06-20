from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class MongoDB:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        self.client = AsyncIOMotorClient(settings.mongodb_url)
        self.db = self.client[settings.mongodb_dbname]
        print("Connected to MongoDB Atlas")

    async def close(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB Atlas")

mongodb = MongoDB()