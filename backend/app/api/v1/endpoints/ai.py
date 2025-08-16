from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from typing import List, Optional
import uuid
from datetime import datetime

from app.models.ai_models import (
    AIRequest, AIResponse, AIMessage, ConversationContext, 
    AIProvider, ConversationSession, AIAnalysisRequest, AIAnalysisResponse
)
from app.services.ai_service import ai_service
from app.core.logging import logger

router = APIRouter()

@router.post("/chat", response_model=AIResponse)
async def chat_with_ai(
    request: AIRequest,
    background_tasks: BackgroundTasks
):
    """
    Chat with AI using specified provider and context
    """
    try:
        # Process AI request
        response = await ai_service.process_request(request)
        
        # Add background task for conversation analysis
        background_tasks.add_task(
            analyze_conversation_background,
            request.messages,
            request.context,
            response
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI service error: {str(e)}"
        )

@router.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_conversation(
    request: AIAnalysisRequest
):
    """
    Analyze conversation for insights and recommendations
    """
    try:
        # This would typically fetch conversation from database
        # For now, we'll use a mock conversation
        mock_messages = [
            AIMessage(role="user", content="Help me study for AWS certification"),
            AIMessage(role="assistant", content="I'll help you create a study plan for AWS certification.")
        ]
        
        mock_context = ConversationContext(domain="aws")
        
        analysis = await ai_service.analyze_conversation(mock_messages, mock_context)
        
        return AIAnalysisResponse(
            analysis_type=request.analysis_type,
            results=analysis,
            insights=[
                "You're focused on AWS certification preparation",
                "Consider hands-on practice with AWS Free Tier",
                "Set up a structured study schedule"
            ],
            recommendations=[
                "Start with AWS fundamentals",
                "Practice with sample exam questions",
                "Join AWS study groups"
            ],
            confidence_score=0.85
        )
        
    except Exception as e:
        logger.error(f"Analysis endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Analysis error: {str(e)}"
        )

@router.get("/providers", response_model=List[str])
async def get_available_providers():
    """
    Get list of available AI providers
    """
    providers = []
    if ai_service.openai_client:
        providers.append("openai")
    if ai_service.gemini_client:
        providers.append("gemini")
    
    return providers

@router.get("/models/{provider}", response_model=List[str])
async def get_available_models(provider: AIProvider):
    """
    Get available models for specified provider
    """
    try:
        if provider == AIProvider.OPENAI:
            return ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"]
        elif provider == AIProvider.GEMINI:
            return ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"]
        else:
            return []
    except Exception as e:
        logger.error(f"Models endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching models: {str(e)}"
        )

@router.post("/conversation/start", response_model=ConversationSession)
async def start_conversation(
    context: ConversationContext,
    provider: AIProvider
):
    """
    Start a new conversation session
    """
    try:
        session = ConversationSession(
            id=str(uuid.uuid4()),
            context=context,
            messages=[],
            provider=provider,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # In a real app, this would be saved to database
        logger.info(f"Started conversation session: {session.id}")
        
        return session
        
    except Exception as e:
        logger.error(f"Start conversation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error starting conversation: {str(e)}"
        )

@router.post("/conversation/{session_id}/message")
async def add_message_to_conversation(
    session_id: str,
    message: AIMessage
):
    """
    Add a message to an existing conversation session
    """
    try:
        # In a real app, this would update the database
        logger.info(f"Added message to session {session_id}: {message.content[:50]}...")
        
        return {
            "message": "Message added successfully",
            "session_id": session_id,
            "timestamp": datetime.utcnow()
        }
        
    except Exception as e:
        logger.error(f"Add message error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error adding message: {str(e)}"
        )

@router.get("/conversation/{session_id}/history")
async def get_conversation_history(session_id: str):
    """
    Get conversation history for a session
    """
    try:
        # In a real app, this would fetch from database
        # For now, return mock data
        mock_messages = [
            AIMessage(
                role="user",
                content="Help me study for AWS certification",
                timestamp=datetime.utcnow()
            ),
            AIMessage(
                role="assistant",
                content="I'll help you create a study plan for AWS certification. Let's start with the fundamentals.",
                timestamp=datetime.utcnow()
            )
        ]
        
        return {
            "session_id": session_id,
            "messages": mock_messages,
            "total_messages": len(mock_messages)
        }
        
    except Exception as e:
        logger.error(f"Get history error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching conversation history: {str(e)}"
        )

async def analyze_conversation_background(
    messages: List[AIMessage],
    context: ConversationContext,
    response: AIResponse
):
    """
    Background task for conversation analysis
    """
    try:
        analysis = await ai_service.analyze_conversation(messages, context)
        logger.info(f"Background analysis completed: {analysis}")
        
        # In a real app, this could trigger notifications, save insights, etc.
        
    except Exception as e:
        logger.error(f"Background analysis error: {str(e)}")
