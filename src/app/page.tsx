'use client';

import React, { useState, useCallback } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { AWSCertificationProject } from '@/components/projects/AWSCertificationProject';
import { AIMessage, ConversationContext, AIProvider } from '@/lib/ai/types';
import { AIProviderFactory as AIFactory } from '@/lib/ai/factory';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'aws'>('chat');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AIProvider | null>(null);

  const handleSendMessage = useCallback(async (message: string, context: ConversationContext) => {
    if (!currentProvider) {
      // For now, we'll use a mock response until we set up API keys
      const mockResponse: AIMessage = {
        role: 'assistant',
        content: `I understand you're asking about ${context.domain}. To get started, you'll need to configure your AI provider API keys in the settings. I can help you with ${context.domain} once that's set up!`,
        timestamp: new Date()
      };
      
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage, mockResponse]);
      return;
    }

    setIsLoading(true);
    
    try {
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);

      const factory = AIFactory.getInstance();
      const aiService = factory.getProvider(currentProvider);
      
      const response = await aiService.sendMessage([...messages, userMessage], context);
      
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration and try again.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentProvider]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab('aws')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'aws'
                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            AWS Certification
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <ChatInterface
          onSendMessage={handleSendMessage}
          messages={messages}
          isLoading={isLoading}
          onProviderChange={setCurrentProvider}
          currentProvider={currentProvider}
        />
      ) : (
        <AWSCertificationProject />
      )}
    </div>
  );
}
