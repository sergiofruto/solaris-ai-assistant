from celery import Celery
from app.core.config import settings
from app.core.logging import logger

celery_app = None

def init_celery():
    """Initialize Celery for background tasks"""
    global celery_app
    try:
        celery_app = Celery(
            "solaris_backend",
            broker=settings.CELERY_BROKER_URL,
            backend=settings.CELERY_RESULT_BACKEND,
            include=['app.tasks']
        )
        
        celery_app.conf.update(
            task_serializer='json',
            accept_content=['json'],
            result_serializer='json',
            timezone='UTC',
            enable_utc=True,
        )
        
        logger.info("✅ Celery initialized for background tasks")
    except Exception as e:
        logger.warning(f"Celery initialization failed: {str(e)}")
        celery_app = None
