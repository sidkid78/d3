// lib/types/agent-types.ts - Agent and Tool Type Definitions

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentQueryParams {
  query: string;
  context?: {
    type?: 'research' | 'code_generation' | 'form_filling' | 'document_generation' | 'image_generation';
    sources?: string[];
    filters?: Record<string, unknown>;
    language?: string;
    template?: string;
    dependencies?: string[];
    securityLevel?: string;
    [key: string]: unknown;
  };
  options?: {
    timeout?: number;
    priority?: 'low' | 'normal' | 'high';
    [key: string]: unknown;
  };
}

export interface AgentQueryResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: {
    executionTime?: number;
    plan?: ExecutionPlan;
    toolsUsed?: string[];
    [key: string]: unknown;
  };
}

export interface ExecutionPlan {
  steps: ExecutionStep[];
  rationale: string;
  expectedDuration: number;
  startTime: number;
  query: string;
  context?: unknown;
}

export interface ExecutionStep {
  id: string;
  name: string;
  tool: string;
  params: Record<string, unknown>;
  dependencies: string[];
  timeout: number;
  retryCount: number;
  priority: number;
}

export interface Tool {
  execute(params: Record<string, unknown>, context?: ExecutionContext): Promise<ToolResult>;
}

export interface ExecutionContext {
  previousResults?: { step: string; result: ToolResult }[];
  context?: unknown;
}

// Research Types
export interface ResearchQuery {
  query: string;
  sources: ('arxiv' | 'pubmed' | 'wikipedia' | 'web')[];
  filters?: {
    dateRange?: { start: string; end: string };
    category?: string;
    maxResults?: number;
  };
}

// Code Generation Types
export interface CodeGenerationRequest {
  description: string;
  language: string;
  template?: string;
  dependencies?: string[];
  securityLevel: 'sandboxed' | 'restricted' | 'standard';
}

// Form Filling Types
export interface FormFillingTask {
  csvData: Record<string, unknown>[];
  targetCompleteness: number;
  strategies: ('rag' | 'research' | 'inference' | 'human')[];
}

export interface GapAnalysisInput {
  csvData: Record<string, unknown>[];
  targetCompleteness: number;
  strategies: ('rag' | 'research' | 'inference' | 'human')[];
}

export interface GapAnalysis {
  gaps: Record<string, unknown>[];
  patterns: Map<string, unknown>;
  totalCells: number;
  completeness: number;
}

export interface FormQuestion {
  question: string;
  suggestedAnswerType: string;
  validationRules: Record<string, unknown>;
  cellCoordinates: { row: number; column: number };
  priority: number;
  suggestedAnswer?: string;
}

export interface Filling {
  rowIndex: number;
  columnName: string;
  value: string;
  confidence: number;
  method: string;
}

// RAG Types
export interface RagQuery {
  query: string;
  sources: ('internal' | 'academic' | 'web')[];
  topK: number;
  threshold: number;
}

// Document Generation Types
export interface DocumentGenerationParams {
  content: string;
  filename: string;
  format?: 'html' | 'pdf' | 'docx';
  template?: string;
  customStyles?: string;
}

// Image Generation Types
export interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  style?: string;
  outputFormat?: 'png' | 'jpeg' | 'webp';
}

// Jupyter Execution Types
export interface JupyterExecutionParams {
  code: string;
  language?: string;
  sessionId?: string;
  maxRetries?: number;
}

// Search Types
export interface DuckDuckGoSearchParams {
  query: string;
  region?: string;
  maxResults?: number;
  safeSearch?: 'strict' | 'moderate' | 'off';
  timeRange?: 'all' | 'day' | 'week' | 'month' | 'year';
}

export interface WikipediaSearchParams {
  query: string;
  language?: string;
  limit?: number;
  fullContent?: boolean;
}

export interface VectorStore {
  search(embedding: number[], source: string, topK: number, threshold: number): Promise<Record<string, unknown>[]>;
  index(document: Record<string, unknown>, source: string): Promise<void>;
}

// Search Result Types
export interface SearchResult extends Record<string, unknown> {
  id: string;
  content: string;
  source: string;
  similarity?: number;
  title?: string;
  url?: string;
  authors?: string;
  type?: string;
  publishedDate?: string;
}

// Image Generation Types
export interface ImageGenerationRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  numImages?: number;
  seed?: number;
  guidanceScale?: number;
  steps?: number;
  style?: 'photorealistic' | 'artistic' | 'creative' | 'fast';
  quality?: 'draft' | 'standard' | 'high' | 'ultra';
  safetyLevel?: '1' | '2' | '3' | '4' | '5' | '6';
  format?: 'jpeg' | 'png';
  model?: string;
  imageUrl?: string;
  strength?: number;
}
