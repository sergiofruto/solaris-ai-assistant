import redis.asyncio as redis
from app.core.config import settings
from app.core.logging import logger

redis_client = None

async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    try:
        redis_client = redis.from_url(settings.REDIS_URL)
        await redis_client.ping()
        logger.info("✅ Redis connection established")
    except Exception as e:
        logger.warning(f"Redis connection failed: {str(e)}")
        # Create a mock client for development
        redis_client = MockRedisClient()

class MockRedisClient:
    """Mock Redis client for development when Redis is not available"""
    
    async def get(self, key: str):
        return None
    
    async def setex(self, key: str, ttl: int, value: str):
        pass
    
    async def ping(self):
        return True
