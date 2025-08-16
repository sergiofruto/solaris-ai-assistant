import OpenAI from 'openai';
import { AIService, AIResponse, AIMessage, ConversationContext } from '../types';

export class OpenAIProvider implements AIService {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async sendMessage(messages: AIMessage[], context: ConversationContext): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      const openaiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const completion = response.choices[0];
      if (!completion?.message?.content) {
        throw new Error('No response content from OpenAI');
      }

      return {
        content: completion.message.content,
        model: this.model,
        provider: 'openai',
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const models = await this.client.models.list();
      return models.data.map(model => model.id);
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      return ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];
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
}
