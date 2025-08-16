from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from enum import Enum

class AIProvider(str, Enum):
    """AI provider options"""
    OPENAI = "openai"
    GEMINI = "gemini"

class ConversationDomain(str, Enum):
    """Conversation domain options"""
    AWS = "aws"
    FINANCE = "finance"
    PROJECTS = "projects"
    UNIVERSITY = "university"
    GENERAL = "general"

class AIMessage(BaseModel):
    """AI message model"""
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConversationContext(BaseModel):
    """Conversation context model"""
    domain: ConversationDomain
    specific_context: Optional[str] = None
    metadata: Optional[dict] = None

class AIRequest(BaseModel):
    """AI service request model"""
    messages: List[AIMessage]
    context: ConversationContext
    provider: AIProvider
    model: Optional[str] = None
    temperature: Optional[float] = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(default=1000, ge=1, le=4000)

class AIResponse(BaseModel):
    """AI service response model"""
    content: str
    model: str
    provider: AIProvider
    usage: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None

class AIProviderConfig(BaseModel):
    """AI provider configuration model"""
    provider: AIProvider
    api_key: str
    model: str
    is_active: bool = True
    rate_limit: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ConversationSession(BaseModel):
    """Conversation session model"""
    id: str
    user_id: Optional[str] = None
    context: ConversationContext
    messages: List[AIMessage]
    provider: AIProvider
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class AIAnalysisRequest(BaseModel):
    """AI analysis request model"""
    conversation_id: str
    analysis_type: Literal["sentiment", "topics", "recommendations", "progress"]
    parameters: Optional[dict] = None

class AIAnalysisResponse(BaseModel):
    """AI analysis response model"""
    analysis_type: str
    results: dict
    insights: List[str]
    recommendations: List[str]
    confidence_score: float = Field(ge=0.0, le=1.0)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
