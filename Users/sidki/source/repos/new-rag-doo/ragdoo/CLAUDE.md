# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RAGDoo is an AI-powered agentic research platform built with Next.js 15, TypeScript, and Google Gemini. It combines RAG (Retrieval-Augmented Generation), multi-tool orchestration, and advanced AI capabilities for research, code generation, document processing, and more.

## Common Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Production build with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Setup

```bash
cp .env.example .env.local    # Create environment file
# Required: GEMINI_API_KEY
# Optional: FAL_KEY (images), REDIS_URL, VECTOR_STORE_URL, JUPYTER_URL
```

## Architecture

### Agent-Based System

The core of this application is an **agent orchestrator** (`lib/agents/orchestrator.ts`) that:

1. Analyzes user queries using Gemini AI
2. Creates execution plans with dependency management
3. Orchestrates multiple tools to complete complex tasks
4. Handles retries, timeouts, and error recovery

**Key Concept**: The orchestrator receives a query, uses Gemini to create a JSON execution plan with steps/tools/dependencies, then executes the plan while managing dependencies and failures.

### Tool System

All tools extend `BaseTool` and implement a standard `execute()` interface:

- **ResearchTool** - ArXiv, PubMed, Wikipedia integration
- **CodeGenerationTool** - Secure code generation with Gemini
- **RagTool** - Vector-based document retrieval
- **FormFillingTool** - CSV gap analysis and completion
- **DocumentGeneratorTool** - Markdown to HTML/PDF conversion
- **ImageGenerationTool** - Stability AI integration (via fal.ai)

Tools are registered in the orchestrator and called dynamically based on the execution plan.

### API Routes

API routes in `app/api/` follow this pattern:

- Individual tool routes (`/api/research`, `/api/generate-code`, etc.) for direct tool access
- Orchestrator route (`/api/query`) for complex multi-tool workflows
- All routes use the same EnvironmentConfig and tool instances

### Frontend Structure

```
app/
├── dashboard/          # Dashboard pages for each tool
│   ├── research/      # Research interface
│   ├── code-gen/      # Code generation UI
│   ├── documents/     # Document upload/RAG
│   ├── form-fill/     # CSV form filling
│   ├── images/        # Image generation
│   └── agent/         # Orchestrator interface
├── api/               # API route handlers
└── page.tsx           # Landing page with hero/features
```

Components use **Framer Motion** for animations and **Tailwind CSS** with a glassmorphism design system.

## Configuration System

### Environment Config (`lib/config/environment.ts`)

Single source of truth for all configuration:

- API keys (Gemini, FAL, Google Search)
- Database URLs (Redis, Vector Store, MongoDB)
- External services (Jupyter)
- Rate limiting settings
- File handling constraints
- Feature flags

**Important**: All tools and API routes import this config. Missing API keys are logged in production but won't crash the app.

### Type Safety

TypeScript types are defined in `lib/types/agent-types.ts`:

- `Tool` interface - Standard tool contract
- `ToolResult` - Standardized result format
- `ExecutionPlan` & `ExecutionStep` - Orchestrator workflow types
- Request/response types for each tool

## Key Patterns

### Tool Execution with Retry Logic

The orchestrator includes built-in retry logic with exponential backoff:

```typescript
// Each step can specify retryCount and timeout
// Failed steps are retried automatically
// Results include metadata about attempts
```

### Dependency Management

Execution steps can declare dependencies:

```typescript
{
  id: "step2",
  dependencies: ["step1"],  // Won't run until step1 completes
  tool: "codeGen",
  params: { /* uses step1 results */ }
}
```

The orchestrator topologically sorts steps and validates dependencies before execution.

### Gemini Integration

Gemini is used in two ways:

1. **Structured JSON generation** - The orchestrator uses `responseMimeType: 'application/json'` with response schemas to get reliable JSON execution plans
2. **Tool-specific tasks** - Each tool uses Gemini for its specific purpose (research synthesis, code generation, form filling, etc.)

### Caching Strategy

Redis is used for:

- Research result caching (ArXiv/PubMed queries)
- Vector embeddings cache
- Rate limiting counters

Falls back gracefully to in-memory caching if Redis is unavailable.

## Development Guidelines

### Adding New Tools

1. Create tool class in `lib/tools/` extending `BaseTool`
2. Define request/response types in `lib/types/agent-types.ts`
3. Register in `orchestrator.ts` `initializeTools()`
4. Create API route in `app/api/[tool-name]/route.ts`
5. Add dashboard page in `app/dashboard/[tool-name]/page.tsx`

### API Route Pattern

```typescript
import { config } from '@/lib/config/environment';
import { YourTool } from '@/lib/tools/your-tool';

export async function POST(request: Request) {
  const tool = new YourTool(config);
  const params = await request.json();
  const result = await tool.execute(params);
  return Response.json(result);
}
```

### Error Handling

- Tools return `ToolResult` with `success: boolean`
- Errors are captured in `error` field, not thrown
- Metadata includes context for debugging
- Client-side components show error states gracefully

### Working with Gemini Models

- Use `gemini-2.5-flash` for fast operations (orchestration, analysis)
- Use `gemini-1.5-pro` for complex reasoning (if needed)
- Always specify `responseMimeType` and `responseSchema` for structured outputs
- Handle streaming responses for better UX where applicable

### Styling

The app uses a **dark theme glassmorphism** design:

- Glass effect: `rgba(255, 255, 255, 0.05)` background with `backdrop-filter: blur(10px)`
- Gradient accents: Purple (#8b5cf6) to Blue (#3b82f6) to Cyan (#06b6d4)
- All animations use GPU-accelerated properties (transform, opacity)
- Tailwind v4 with `@tailwindcss/postcss`

## Testing Strategy

- Test orchestrator dependency resolution with circular dependency detection
- Mock Gemini API responses for consistent testing
- Verify tool error handling and retry logic
- Test caching behavior with and without Redis
- Validate type safety across tool interfaces

## Important Notes

- The app is designed to work with missing API keys (graceful degradation)
- Redis/Vector DB are optional - the app uses in-memory fallbacks
- Jupyter integration is for future code execution features
- All user inputs should be validated before passing to tools
- Rate limiting is per-endpoint using Redis counters
- File uploads are validated against `allowedFileTypes` and `maxFileSize`

## Path Aliases

TypeScript paths use `@/*` for root-level imports:
```typescript
import { config } from '@/lib/config/environment';
import { ResearchTool } from '@/lib/tools/research-tool';
```
