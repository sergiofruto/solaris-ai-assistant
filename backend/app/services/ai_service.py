import asyncio
import httpx
from typing import List, Optional, Dict, Any
import openai
import google.generativeai as genai
from datetime import datetime
import uuid

from app.models.ai_models import (
    AIRequest, AIResponse, AIMessage, ConversationContext, 
    AIProvider, AIProviderConfig, ConversationDomain
)
from app.core.config import settings
from app.core.cache import redis_client
from app.core.logging import logger

class AIService:
    """AI service for handling OpenAI and Gemini interactions"""
    
    def __init__(self):
        self.openai_client = None
        self.gemini_client = None
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize AI provider clients"""
        if settings.OPENAI_API_KEY:
            openai.api_key = settings.OPENAI_API_KEY
            self.openai_client = openai
        
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_client = genai
    
    async def process_request(self, request: AIRequest) -> AIResponse:
        """Process AI request and return response"""
        request_id = str(uuid.uuid4())
        
        # Check cache first
        cache_key = self._generate_cache_key(request)
        cached_response = await self._get_cached_response(cache_key)
        if cached_response:
            return cached_response
        
        try:
            if request.provider == AIProvider.OPENAI:
                response = await self._call_openai(request)
            elif request.provider == AIProvider.GEMINI:
                response = await self._call_gemini(request)
            else:
                raise ValueError(f"Unsupported AI provider: {request.provider}")
            
            # Cache the response
            await self._cache_response(cache_key, response)
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing AI request: {str(e)}")
            raise
    
    async def _call_openai(self, request: AIRequest) -> AIResponse:
        """Call OpenAI API"""
        if not self.openai_client:
            raise ValueError("OpenAI client not initialized")
        
        try:
            # Prepare messages for OpenAI
            messages = []
            if request.context.domain != "general":
                system_prompt = self._build_system_prompt(request.context)
                messages.append({"role": "system", "content": system_prompt})
            
            for msg in request.messages:
                messages.append({
                    "role": msg.role,
                    "content": msg.content
                })
            
            # Make API call
            response = await asyncio.to_thread(
                self.openai_client.ChatCompletion.create,
                model=request.model or "gpt-4o-mini",
                messages=messages,
                temperature=request.temperature,
                max_tokens=request.max_tokens
            )
            
            return AIResponse(
                content=response.choices[0].message.content,
                model=response.model,
                provider=AIProvider.OPENAI,
                usage=response.usage.dict() if response.usage else None,
                request_id=str(uuid.uuid4())
            )
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
    
    async def _call_gemini(self, request: AIRequest) -> AIResponse:
        """Call Gemini API"""
        if not self.gemini_client:
            raise ValueError("Gemini client not initialized")
        
        try:
            # Prepare prompt for Gemini
            system_prompt = self._build_system_prompt(request.context)
            conversation_prompt = self._format_conversation_for_gemini(request.messages)
            full_prompt = f"{system_prompt}\n\n{conversation_prompt}"
            
            # Make API call
            model = self.gemini_client.GenerativeModel(
                request.model or 'gemini-1.5-flash'
            )
            
            response = await asyncio.to_thread(
                model.generate_content,
                full_prompt
            )
            
            return AIResponse(
                content=response.text,
                model=request.model or 'gemini-1.5-flash',
                provider=AIProvider.GEMINI,
                usage={"total_tokens": len(full_prompt.split())},  # Approximate
                request_id=str(uuid.uuid4())
            )
            
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise
    
    def _build_system_prompt(self, context: ConversationContext) -> str:
        """Build system prompt based on conversation context"""
        base_prompt = "You are Solaris, a helpful AI assistant designed to help with various domains. Be concise, helpful, and professional."
        
        domain_prompts = {
            "aws": "Focus on AWS development, best practices, and certification preparation. Provide practical examples and explanations.",
            "finance": "Help with financial organization, budgeting, and financial planning. Be practical and educational.",
            "projects": "Assist with project planning, organization, and tracking. Help break down tasks and set milestones.",
            "university": "Support academic studies with clear explanations, study strategies, and learning techniques.",
            "general": "Provide general assistance and guidance across various topics."
        }
        
        return f"{base_prompt}\n\n{domain_prompts.get(context.domain.value, domain_prompts['general'])}"
    
    def _format_conversation_for_gemini(self, messages: List[AIMessage]) -> str:
        """Format conversation history for Gemini"""
        formatted = []
        for msg in messages:
            role = "User" if msg.role == "user" else "Assistant"
            formatted.append(f"{role}: {msg.content}")
        return "\n\n".join(formatted)
    
    def _generate_cache_key(self, request: AIRequest) -> str:
        """Generate cache key for request"""
        # Create a hash of the request content for caching
        content_hash = hash(str(request.messages) + str(request.context) + request.provider.value)
        return f"ai_response:{content_hash}"
    
    async def _get_cached_response(self, cache_key: str) -> Optional[AIResponse]:
        """Get cached response if available"""
        try:
            cached = await redis_client.get(cache_key)
            if cached:
                return AIResponse.parse_raw(cached)
        except Exception as e:
            logger.warning(f"Cache retrieval error: {str(e)}")
        return None
    
    async def _cache_response(self, cache_key: str, response: AIResponse, ttl: int = 3600):
        """Cache response with TTL"""
        try:
            await redis_client.setex(cache_key, ttl, response.json())
        except Exception as e:
            logger.warning(f"Cache storage error: {str(e)}")
    
    async def analyze_conversation(self, messages: List[AIMessage], context: ConversationContext) -> Dict[str, Any]:
        """Analyze conversation for insights"""
        try:
            # Simple analysis - can be enhanced with more sophisticated ML
            analysis = {
                "message_count": len(messages),
                "user_messages": len([m for m in messages if m.role == "user"]),
                "assistant_messages": len([m for m in messages if m.role == "assistant"]),
                "domain": context.domain.value,
                "conversation_length": sum(len(m.content) for m in messages),
                "topics": self._extract_topics(messages),
                "sentiment": "positive",  # Placeholder - could use sentiment analysis
                "recommendations": self._generate_recommendations(context.domain, messages)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Conversation analysis error: {str(e)}")
            return {"error": str(e)}
    
    def _extract_topics(self, messages: List[AIMessage]) -> List[str]:
        """Extract main topics from conversation"""
        # Simple topic extraction - could be enhanced with NLP
        topics = []
        for msg in messages:
            content = msg.content.lower()
            if "aws" in content:
                topics.append("AWS")
            if "ec2" in content or "lambda" in content or "s3" in content:
                topics.append("AWS Services")
            if "study" in content or "learn" in content:
                topics.append("Learning")
            if "project" in content:
                topics.append("Project Management")
        
        return list(set(topics))
    
    def _generate_recommendations(self, domain: ConversationDomain, messages: List[AIMessage]) -> List[str]:
        """Generate recommendations based on domain and conversation"""
        recommendations = []
        
        if domain.value == "aws":
            recommendations.extend([
                "Consider hands-on labs with AWS Free Tier",
                "Review AWS Well-Architected Framework",
                "Practice with sample exam questions"
            ])
        elif domain.value == "finance":
            recommendations.extend([
                "Track your expenses regularly",
                "Set up automatic savings",
                "Review your budget monthly"
            ])
        elif domain.value == "projects":
            recommendations.extend([
                "Break down large tasks into smaller ones",
                "Set realistic deadlines",
                "Track progress regularly"
            ])
        
        return recommendations

# Global AI service instance
ai_service = AIService()
