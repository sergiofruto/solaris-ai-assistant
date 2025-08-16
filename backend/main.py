from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import uvicorn
from typing import List, Optional
import os
from dotenv import load_dotenv

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.api import api_router
from app.core.cache import init_redis
from app.core.celery_app import init_celery

# Load environment variables
load_dotenv()

# Security
security = HTTPBearer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting Solaris AI Backend...")
    await init_db()
    await init_redis()
    init_celery()
    print("✅ Backend services initialized")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down Solaris AI Backend...")

# Create FastAPI app
app = FastAPI(
    title="Solaris AI Assistant API",
    description="AI-powered learning and project management backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🚀 Solaris AI Assistant Backend",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "solaris-ai-backend",
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
