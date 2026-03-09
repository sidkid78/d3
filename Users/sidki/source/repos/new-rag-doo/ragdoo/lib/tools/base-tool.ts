// lib/tools/base-tool.ts - Base Tool Interface

import { ToolResult, Tool } from '@/lib/types/agent-types';

export abstract class BaseTool implements Tool {
  abstract execute(params: unknown, context?: unknown): Promise<ToolResult>; 
  
  protected createResult(success: boolean, data?: unknown, error?: string, metadata?: Record<string, unknown>): ToolResult {
    return {
      success,
      data,
      error,
      metadata
    };
  }
}
