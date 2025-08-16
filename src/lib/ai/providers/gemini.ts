import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIService, AIResponse, AIMessage, ConversationContext } from '../types';

export class GeminiProvider implements AIService {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-1.5-flash') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context: ConversationContext): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const geminiModel = this.genAI.getGenerativeModel({ model: this.model });
      
      // Combine system prompt with conversation history
      const prompt = `${systemPrompt}\n\n${this.formatMessagesForGemini(messages)}`;
      
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response content from Gemini');
      }

      return {
        content,
        model: this.model,
        provider: 'gemini',
        usage: {
          promptTokens: 0, // Gemini doesn't provide token usage in the same way
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      // Gemini has a limited set of models
      return ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro'];
    } catch (error) {
      console.error('Error fetching Gemini models:', error);
      return ['gemini-1.5-flash', 'gemini-1.5-pro'];
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    const basePrompt = `You are Solaris, a helpful AI assistant designed to help with various domains. Be concise, helpful, and professional.`;
    
    const domainPrompts = {
      aws: `Focus on AWS development, best practices, and certification preparation. Provide practical examples and explanations.`,
      finance: `Help with financial organization, budgeting, and financial planning. Be practical and educational.`,
      projects: `Assist with project planning, organization, and tracking. Help break down tasks and set milestones.`,
      university: `Support academic studies with clear explanations, study strategies, and learning techniques.`,
      general: `Provide general assistance and guidance across various topics.`
    };

    return `${basePrompt}\n\n${domainPrompts[context.domain] || domainPrompts.general}`;
  }

  private formatMessagesForGemini(messages: AIMessage[]): string {
    return messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
  }
}
