#!/usr/bin/env python3
"""
Solaris AI Backend Startup Script
Run this to start the FastAPI backend server
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    print("🚀 Starting Solaris AI Backend...")
    print("📚 API Documentation will be available at: http://localhost:8000/docs")
    print("🔧 Health check: http://localhost:8000/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
