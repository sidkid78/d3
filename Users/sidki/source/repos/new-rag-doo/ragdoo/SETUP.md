# Agentic Research Platform - Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   STABILITY_API_KEY=your_stability_api_key_here  # Optional
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Open the Application**
   Visit [http://localhost:3000](http://localhost:3000)

## Features Available

### ✅ Currently Working
- **Main Dashboard** - Overview and navigation
- **Research Assistant** - Search ArXiv, PubMed, Wikipedia
- **Code Generation** - Generate secure code with Gemini
- **Form Filling** - CSV gap analysis and intelligent completion
- **Agent Orchestrator** - Intelligent multi-tool workflows

### 🚧 Requires Additional Setup
- **Image Generation** - Needs Stability AI API key
- **Document Generation** - Works for HTML, PDF requires Puppeteer setup
- **Vector RAG** - Currently uses mock data, needs vector database
- **Jupyter Integration** - Needs Jupyter server setup
- **Redis Caching** - Optional, falls back to in-memory

## File Structure

```
ragdoo/
├── app/
│   ├── api/                    # API routes
│   │   ├── query/route.ts      # Main orchestrator
│   │   ├── research/route.ts   # Research endpoint
│   │   ├── generate-code/route.ts
│   │   └── form-fill/route.ts
│   ├── dashboard/              # Dashboard pages
│   │   ├── page.tsx            # Main dashboard
│   │   └── research/page.tsx   # Research page
│   └── layout.tsx
├── lib/
│   ├── agents/
│   │   └── orchestrator.ts     # Main agent logic
│   ├── tools/                  # Tool implementations
│   │   ├── research-tool.ts
│   │   ├── code-generation-tool.ts
│   │   ├── form-filling-tool.ts
│   │   └── rag-tool.ts
│   ├── config/
│   │   └── environment.ts      # Environment config
│   ├── types/
│   │   └── agent-types.ts      # Type definitions
│   └── hooks/
│       └── use-agent-query.ts  # React hooks
├── components/
│   └── forms/
│       └── research-form.tsx   # Research interface
└── .env.example               # Environment template
```

## Usage Examples

### Research Assistant
1. Go to `/dashboard/research`
2. Enter your research question
3. Select sources (ArXiv, PubMed, Wikipedia)
4. Click "Start Research"

### Code Generation
```bash
curl -X POST http://localhost:3000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Create a React component that displays a loading spinner",
    "language": "typescript",
    "template": "component"
  }'
```

### Agent Orchestrator
```bash
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Research machine learning applications in healthcare and generate a summary report",
    "context": {
      "type": "research"
    }
  }'
```

## Extending the Platform

### Adding New Tools
1. Create a new tool in `lib/tools/`
2. Implement the `Tool` interface
3. Register it in `lib/agents/orchestrator.ts`
4. Add API route in `app/api/`

### Adding New Components
1. Create component in `components/`
2. Add to dashboard page
3. Create corresponding hook if needed

## API Keys Setup

### Required
- **GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Optional
- **STABILITY_API_KEY**: For image generation
- **REDIS_URL**: For caching
- **JUPYTER_URL**: For code execution

## Next Steps

1. **Add your Gemini API key** to `.env.local`
2. **Test the research functionality** with a simple query
3. **Try code generation** with a basic request
4. **Explore the agent orchestrator** with complex queries
5. **Set up additional services** as needed (Redis, Vector DB, etc.)

## Troubleshooting

### Common Issues
- **"GEMINI_API_KEY is not set"** - Add your API key to `.env.local`
- **Research returns no results** - Check network connectivity to external APIs
- **TypeScript errors** - Run `npm run build` to check for issues

### Development Tips
- Use `npm run dev` for hot reloading
- Check browser console for client-side errors
- Check terminal for server-side errors
- Use the Network tab to debug API calls

## Production Deployment

Before deploying to production:

1. Set all required environment variables
2. Set up Redis for caching
3. Set up a proper vector database
4. Configure rate limiting
5. Set up monitoring and logging
6. Enable security features

The platform is designed to be scalable and production-ready with proper configuration.
