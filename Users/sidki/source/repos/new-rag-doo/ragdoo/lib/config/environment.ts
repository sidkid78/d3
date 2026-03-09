// lib/config/environment.ts - Environment Configuration

export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  
  // API Keys
  geminiApiKey: string;
  falApiKey: string;
  googleApiKey: string;
  googleSearchEngineId: string;
  
  // Database & Cache
  redisUrl: string;
  vectorStoreUrl: string;
  
  // External Services
  jupyterUrl: string;
  
  // Security & Rate Limiting
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  
  // File Handling
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // Feature Flags
  enableCodeExecution: boolean;
  enableImageGeneration: boolean;
  enableDocumentGeneration: boolean;
}

export const config: EnvironmentConfig = {
  NODE_ENV: (process.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) || 'development',
  
  // API Keys
  geminiApiKey: process.env.GEMINI_API_KEY!,
  falApiKey: process.env.FAL_KEY!,
  googleApiKey: process.env.GOOGLE_API_KEY!,
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID!,
  
  // Database & Cache
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  vectorStoreUrl: process.env.VECTOR_STORE_URL || 'http://localhost:8000',
  
  // External Services
  jupyterUrl: process.env.JUPYTER_URL || 'http://localhost:8888',
  
  // Security & Rate Limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // File Handling
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,docx,txt,md,csv,json').split(','),
  
  // Feature Flags
  enableCodeExecution: process.env.ENABLE_CODE_EXECUTION === 'true',
  enableImageGeneration: process.env.ENABLE_IMAGE_GENERATION === 'true',
  enableDocumentGeneration: process.env.ENABLE_DOCUMENT_GENERATION === 'true'
};

// Validate required environment variables
if (!config.geminiApiKey && process.env.NODE_ENV === 'production') {
  console.warn('GEMINI_API_KEY is not set');
}
