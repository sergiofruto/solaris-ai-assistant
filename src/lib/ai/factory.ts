import { AIService, AIProvider } from './types';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

export class AIProviderFactory {
  private static instance: AIProviderFactory;
  private providers: Map<string, AIService> = new Map();

  private constructor() {}

  static getInstance(): AIProviderFactory {
    if (!AIProviderFactory.instance) {
      AIProviderFactory.instance = new AIProviderFactory();
    }
    return AIProviderFactory.instance;
  }

  createProvider(provider: AIProvider): AIService {
    const key = `${provider.name}-${provider.model}`;
    
    if (this.providers.has(key)) {
      return this.providers.get(key)!;
    }

    let aiService: AIService;

    switch (provider.name) {
      case 'openai':
        aiService = new OpenAIProvider(provider.apiKey, provider.model);
        break;
      case 'gemini':
        aiService = new GeminiProvider(provider.apiKey, provider.model);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${provider.name}`);
    }

    this.providers.set(key, aiService);
    return aiService;
  }

  getProvider(provider: AIProvider): AIService {
    const key = `${provider.name}-${provider.model}`;
    
    if (!this.providers.has(key)) {
      return this.createProvider(provider);
    }

    return this.providers.get(key)!;
  }

  clearProviders(): void {
    this.providers.clear();
  }
}
