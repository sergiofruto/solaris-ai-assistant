from fastapi import APIRouter
from app.api.v1.endpoints import ai

api_router = APIRouter()

# Include AI endpoints
api_router.include_router(ai.router, prefix="/ai", tags=["AI Services"])
