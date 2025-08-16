export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AIConversation {
  id: string;
  title: string;
  messages: AIMessage[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationContext {
  domain: 'aws' | 'finance' | 'projects' | 'university' | 'general';
  specificContext?: string;
  metadata?: Record<string, any>;
}

export interface AIProvider {
  name: 'openai' | 'gemini';
  apiKey: string;
  model: string;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIService {
  sendMessage(messages: AIMessage[], context: ConversationContext): Promise<AIResponse>;
  getAvailableModels(): Promise<string[]>;
}
