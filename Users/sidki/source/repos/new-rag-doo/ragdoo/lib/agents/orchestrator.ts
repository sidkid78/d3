// lib/agents/orchestrator.ts - Main Agent Orchestrator

import { GoogleGenAI } from '@google/genai';
import { createClient, RedisClientType } from 'redis';
import { 
  ToolResult, 
  AgentQueryParams, 
  AgentQueryResult, 
  ExecutionPlan, 
  ExecutionStep, 
  Tool,
  ResearchQuery,
  CodeGenerationRequest,
  DocumentGenerationParams,
  FormFillingTask,
  RagQuery,
  ImageGenerationRequest
} from '@/lib/types/agent-types';
import { EnvironmentConfig } from '@/lib/config/environment';
import { ResearchTool } from '@/lib/tools/research-tool';
import { CodeGenerationTool } from '@/lib/tools/code-generation-tool';
import { DocumentGeneratorTool } from '@/lib/tools/document-generator-tool';
import { FormFillingTool } from '@/lib/tools/form-filling-tool';
import { RagTool } from '@/lib/tools/rag-tool';
import { ImageGenerationTool } from '@/lib/tools/image-generation-tool';

export class AgentOrchestrator {
  private gemini: GoogleGenAI;
  private redis: RedisClientType;
  private tools: Map<string, Tool> = new Map();

  constructor(config: EnvironmentConfig) {
    this.gemini = new GoogleGenAI({ apiKey: config.geminiApiKey });
    this.redis = createClient({ url: config.redisUrl });
    this.initializeTools(config);
  }

  private initializeTools(config: EnvironmentConfig) {
    // Create tool wrappers to match the Tool interface
    const researchTool = new ResearchTool(config);
    const codeGenTool = new CodeGenerationTool(config);
    const docGenTool = new DocumentGeneratorTool(config);
    const formFillTool = new FormFillingTool(config);
    const ragTool = new RagTool(config);
    const imageGenTool = new ImageGenerationTool(config);

    this.tools.set('research', {
      execute: (params, context) => researchTool.execute(params as unknown as ResearchQuery, context?.context)
    });
    this.tools.set('codeGen', {
      execute: async (params) => codeGenTool.execute(params as unknown as CodeGenerationRequest)
    });
    this.tools.set('docGen', {
      execute: async (params) => docGenTool.execute(params as unknown as DocumentGenerationParams)
    });
    this.tools.set('formFill', {
      execute: async (params) => formFillTool.execute(params as unknown as FormFillingTask)
    });
    this.tools.set('rag', {
      execute: async (params) => ragTool.execute(params as unknown as RagQuery)
    });
    this.tools.set('imageGen', {
      execute: async (params) => imageGenTool.execute(params as unknown as ImageGenerationRequest)
    });
  }

  async processQuery(params: AgentQueryParams): Promise<AgentQueryResult> {
    try {
      // Analyze query intent and determine tool chain
      const plan = await this.createExecutionPlan(params.query, params.context);
      
      // Execute planned workflow
      const results = await this.executeWorkflow(plan);
      
      return {
        success: true,
        data: results,
        metadata: { 
          plan, 
          executionTime: Date.now() - plan.startTime,
          toolsUsed: plan.steps.map(s => s.tool)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: { query: params.query, context: params.context }
      };
    }
  }

  private async createExecutionPlan(query: string, context?: unknown): Promise<ExecutionPlan> {
    const prompt = `Analyze this query and create an execution plan using available tools:
    Query: ${query}
    Context: ${JSON.stringify(context)}
    
    Available tools: ${Array.from(this.tools.keys()).join(', ')}
    
    Return a JSON execution plan with steps, tool selection rationale, and expected outcomes.`;

    const response = await this.gemini.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            steps: { 
              type: 'array', 
              items: { 
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  tool: { type: 'string' },
                  params: { type: 'object' },
                  dependencies: { 
                    type: 'array',
                    items: { type: 'string' }
                  },
                  timeout: { type: 'number' },
                  retryCount: { type: 'number' },
                  priority: { type: 'number' }
                }
              } 
            },
            rationale: { type: 'string' },
            expectedDuration: { type: 'number' }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error('No response from AI model');
    }
    const planData = JSON.parse(response.text);
    
    // Ensure ExecutionStep structure compliance
    const steps: ExecutionStep[] = (planData.steps || []).map((step: Record<string, unknown>) => ({
      id: step.id || `step_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: step.name,
      tool: step.tool,
      params: step.params || {},
      dependencies: step.dependencies || [],
      timeout: step.timeout || 30000,
      retryCount: step.retryCount || 0,
      priority: step.priority || 1
    }));
    
    return {
      ...planData,
      steps,
      startTime: Date.now(),
      query,
      context
    };
  }

  private async executeWorkflow(plan: ExecutionPlan): Promise<{ step: string; result: ToolResult }[]> {
    const results: { step: string; result: ToolResult }[] = [];
    const completedSteps = new Set<string>();
    
    // Sort steps by priority and dependencies
    const sortedSteps = this.sortStepsByDependencies(plan.steps);
    
    for (const step of sortedSteps) {
      // Check if dependencies are satisfied
      const dependenciesMet = step.dependencies.every(dep => completedSteps.has(dep));
      if (!dependenciesMet) {
        const missingDeps = step.dependencies.filter(dep => !completedSteps.has(dep));
        const errorResult: ToolResult = {
          success: false,
          error: `Dependencies not met: ${missingDeps.join(', ')}`,
          data: null,
          metadata: {
            stepId: step.id,
            missingDependencies: missingDeps
          }
        };
        results.push({ step: step.name, result: errorResult });
        continue;
      }

      const tool = this.tools.get(step.tool);
      if (!tool) {
        console.warn(`Tool not found: ${step.tool}`);
        const errorResult: ToolResult = {
          success: false,
          error: `Tool not found: ${step.tool}`,
          data: null,
          metadata: {
            stepId: step.id,
            availableTools: Array.from(this.tools.keys())
          }
        };
        results.push({ step: step.name, result: errorResult });
        continue;
      }

      try {
        const result = await this.executeStepWithRetry(step, tool, {
          previousResults: results,
          context: plan.context
        });

        results.push({ step: step.name, result });
        
        if (result.success) {
          completedSteps.add(step.id);
        }
      } catch (error) {
        const errorResult: ToolResult = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          data: null,
          metadata: {
            stepId: step.id,
            executionError: true
          }
        };
        
        console.warn(`Step execution failed: ${step.tool}`, error);
        results.push({ 
          step: step.name, 
          result: errorResult
        });
      }
    }

    return results;
  }

  private async executeStepWithRetry(
    step: ExecutionStep, 
    tool: Tool, 
    context: { previousResults?: { step: string; result: ToolResult }[]; context?: unknown }
  ): Promise<ToolResult> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= step.retryCount; attempt++) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Step execution timeout')), step.timeout);
        });
        
        const executionPromise = tool.execute(step.params, context);
        
        const result = await Promise.race([executionPromise, timeoutPromise]);
        
        // Ensure result conforms to ToolResult interface
        const toolResult: ToolResult = {
          success: result.success,
          data: result.data,
          error: result.error || undefined,
          metadata: {
            ...result.metadata,
            stepId: step.id,
            attempt: attempt + 1,
            executionTime: Date.now()
          }
        };
        
        if (toolResult.success) {
          return toolResult;
        }
        
        lastError = new Error(toolResult.error || 'Tool execution failed');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < step.retryCount) {
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    return {
      success: false,
      error: lastError?.message || 'Step execution failed after all retries',
      data: null,
      metadata: {
        stepId: step.id,
        totalAttempts: step.retryCount + 1,
        finalError: true
      }
    };
  }

  private sortStepsByDependencies(steps: ExecutionStep[]): ExecutionStep[] {
    const sorted: ExecutionStep[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const visit = (step: ExecutionStep) => {
      if (visiting.has(step.id)) {
        throw new Error(`Circular dependency detected involving step: ${step.id}`);
      }
      
      if (visited.has(step.id)) {
        return;
      }
      
      visiting.add(step.id);
      
      // Visit dependencies first
      for (const depId of step.dependencies) {
        const depStep = steps.find(s => s.id === depId);
        if (depStep) {
          visit(depStep);
        }
      }
      
      visiting.delete(step.id);
      visited.add(step.id);
      sorted.push(step);
    };
    
    // Sort by priority first, then process dependencies
    const prioritySorted = [...steps].sort((a, b) => b.priority - a.priority);
    
    for (const step of prioritySorted) {
      if (!visited.has(step.id)) {
        visit(step);
      }
    }
    
    return sorted;
  }
}
