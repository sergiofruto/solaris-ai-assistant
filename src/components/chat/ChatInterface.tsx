'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, BookOpen, DollarSign, FolderOpen, GraduationCap } from 'lucide-react';
import { AIMessage, ConversationContext, AIProvider } from '@/lib/ai/types';
import { ChatMessage } from './ChatMessage';
import { DomainSelector } from './DomainSelector';
import { SettingsDialog } from '../settings/SettingsDialog';

interface ChatInterfaceProps {
  onSendMessage: (message: string, context: ConversationContext) => Promise<void>;
  messages: AIMessage[];
  isLoading: boolean;
  onProviderChange: (provider: AIProvider) => void;
  currentProvider: AIProvider | null;
}

export function ChatInterface({ onSendMessage, messages, isLoading, onProviderChange, currentProvider }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<ConversationContext['domain']>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const context: ConversationContext = {
      domain: selectedDomain,
      specificContext: `User is asking about ${selectedDomain}`
    };

    await onSendMessage(inputMessage, context);
    setInputMessage('');
  };

  const domainIcons = {
    aws: <BookOpen className="w-4 h-4" />,
    finance: <DollarSign className="w-4 h-4" />,
    projects: <FolderOpen className="w-4 h-4" />,
    university: <GraduationCap className="w-4 h-4" />,
    general: <MessageCircle className="w-4 h-4" />
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Solaris AI</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your Personal AI Assistant</p>
          </div>
        </div>
        <SettingsDialog
          onProviderChange={onProviderChange}
          currentProvider={currentProvider}
        />
      </div>

      {/* Domain Selector */}
      <DomainSelector
        selectedDomain={selectedDomain}
        onDomainChange={setSelectedDomain}
        domainIcons={domainIcons}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Welcome to Solaris!
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              I'm here to help you with AWS certification, finances, projects, and university studies.
              <br />
              What would you like to work on today?
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            <span>Solaris is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Solaris anything..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
