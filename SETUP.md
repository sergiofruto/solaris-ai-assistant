# Solaris AI Assistant - Setup Guide

## Getting Started

Solaris is your personal AI assistant that can help you with:
- **AWS Certification** - Study for AWS Developer Certificate
- **Finance** - Organize and plan your finances
- **Projects** - Create and track projects
- **University** - Academic studies and research
- **General** - General assistance across topics

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure AI Provider API Keys

Create a `.env.local` file in the root directory with your API keys:

```bash
# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=pasteyourkeyhere

# Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=pasteyourkeyhere

# Default AI Provider (openai or gemini)
DEFAULT_AI_PROVIDER=openai

# Default AI Model
DEFAULT_AI_MODEL=gpt-4o-mini
```

### 3. Get API Keys

#### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env.local` file

#### Google Gemini
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env.local` file

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Solaris in action!

### 5. Configure in the App
1. Click the Settings icon (gear) in the top right
2. Select your preferred AI provider (OpenAI or Gemini)
3. Choose your preferred model
4. Enter your API key
5. Click "Save Configuration"

## Features

- **Agnostic AI** - Switch between OpenAI and Gemini seamlessly
- **Domain-Specific Context** - Tailored responses for different areas of focus
- **Modern UI** - Clean, responsive interface with dark mode support
- **Real-time Chat** - Instant responses from your chosen AI provider
- **Context Awareness** - AI understands what domain you're working in

## Usage

1. **Select a Domain** - Choose what you want to work on (AWS, Finance, Projects, University, or General)
2. **Ask Questions** - Type your questions in the chat input
3. **Get AI Help** - Solaris will provide context-aware responses
4. **Switch Providers** - Change between OpenAI and Gemini as needed

## Troubleshooting

- **API Key Issues** - Make sure your API keys are correct and have sufficient credits
- **Model Selection** - Some models may not be available depending on your API access
- **Rate Limits** - Both providers have rate limits; if you hit them, wait a moment and try again

## Next Steps

- Add conversation history persistence
- Implement project tracking features
- Add financial planning tools
- Create study progress tracking
- Build AWS certification study plans

Happy coding with Solaris! 🚀
