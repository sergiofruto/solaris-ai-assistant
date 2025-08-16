# 🚀 Solaris AI Assistant

> **Your Personal AI-Powered Learning & Project Management Assistant**

A sophisticated, full-stack AI assistant built with Next.js 15, TypeScript, and modern AI APIs. Solaris helps you study for AWS certifications, manage projects, organize finances, and excel in university studies through intelligent, context-aware AI interactions.

## ✨ **Features**

### 🤖 **AI-Powered Intelligence**
- **Multi-Provider Support**: OpenAI GPT-4o and Google Gemini integration
- **Context-Aware Responses**: Understands different domains (AWS, Finance, Projects, University)
- **Agnostic Architecture**: Seamlessly switch between AI providers
- **Smart Prompting**: Domain-specific system prompts for targeted assistance

### 📚 **AWS Certification Management**
- **Structured Study Plans**: 12-14 week roadmaps for AWS certifications
- **Week-by-Week Tracking**: Detailed weekly goals and study tasks
- **Progress Monitoring**: Visual progress indicators and completion tracking
- **Multiple Paths**: Developer, Solutions Architect, and SysOps Associate

### 🎯 **Project Management**
- **Task Organization**: Create, track, and complete study objectives
- **Timeline Planning**: Set target dates and monitor progress
- **Resource Management**: Curated learning resources and recommendations
- **Status Tracking**: Planning → In Progress → Completed workflow

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark Mode Support**: Beautiful dark/light theme switching
- **Professional Interface**: Clean, intuitive user experience
- **Real-time Updates**: Instant feedback and progress tracking

## 🛠 **Tech Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **AI Integration**: OpenAI API, Google Gemini API
- **State Management**: React hooks with localStorage persistence
- **Build Tool**: Turbopack for fast development
- **Deployment**: Vercel-ready configuration

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18.18.0 or higher
- npm, yarn, or pnpm
- OpenAI API key and/or Google Gemini API key

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/solaris-ai-assistant.git
cd solaris-ai-assistant

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### **Environment Variables**
Create a `.env.local` file with your AI provider API keys:
```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Default AI Provider
DEFAULT_AI_PROVIDER=openai
```

## 📖 **Usage**

### **AI Chat**
1. Select a domain (AWS, Finance, Projects, University)
2. Ask questions and get intelligent, context-aware responses
3. Switch between OpenAI and Gemini as needed

### **AWS Certification Projects**
1. Create a new certification project
2. Choose your target certification path
3. Follow the structured weekly study plan
4. Track progress and mark tasks complete

### **Project Management**
- **Planning**: Set up your study roadmap
- **In Progress**: Track weekly objectives
- **Completed**: Monitor your achievements

## 🎯 **Use Cases**

### **For Developers**
- AWS certification preparation
- Project planning and tracking
- Technical learning assistance
- Code review and best practices

### **For Students**
- University study support
- Research assistance
- Assignment planning
- Exam preparation

### **For Professionals**
- Financial planning and organization
- Project management
- Skill development
- Career planning

## 🔧 **Architecture**

```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── chat/           # AI chat interface
│   ├── projects/       # Project management
│   └── settings/       # Configuration UI
├── lib/                # Core logic
│   ├── ai/             # AI service layer
│   └── projects/       # Project management logic
└── types/              # TypeScript definitions
```

## 🌟 **Key Features in Detail**

### **AI Service Layer**
- Provider-agnostic architecture
- Automatic context injection
- Error handling and fallbacks
- Rate limiting considerations

### **Project Management**
- Local storage persistence
- Real-time progress updates
- Flexible status management
- Template-based project creation

### **User Experience**
- Responsive design patterns
- Accessibility considerations
- Performance optimizations
- Modern UI components

## 🤝 **Contributing**

Contributions are welcome! This project demonstrates:
- Modern React patterns
- AI integration best practices
- TypeScript implementation
- Professional UI/UX design

## 📄 **License**

MIT License - feel free to use this project for learning, portfolio, or commercial purposes.

## 🎉 **Showcase Your Skills**

This project demonstrates proficiency in:
- **Full-Stack Development**: Next.js, React, TypeScript
- **AI Integration**: OpenAI and Gemini APIs
- **Modern UI/UX**: Tailwind CSS, Radix UI
- **Project Architecture**: Clean code, proper separation of concerns
- **Real-World Applications**: Practical AI assistant implementation

---

**Built with ❤️ and AI by [Your Name]**

*Ready to revolutionize how you learn and manage projects with AI!*
