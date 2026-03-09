// lib/tools/code-generation-tool.ts - Code Generation Tool

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { BaseTool } from './base-tool';
import { ToolResult, CodeGenerationRequest } from '@/lib/types/agent-types';
import { EnvironmentConfig } from '@/lib/config/environment';

export class CodeGenerationTool extends BaseTool {
  private gemini: GoogleGenAI;
  private templates: Map<string, string> = new Map();

  constructor(private config: EnvironmentConfig) {
    super();  
    this.gemini = new GoogleGenAI({ apiKey: config.geminiApiKey });
    this.loadTemplates();
  }
  async execute(params: CodeGenerationRequest): Promise<ToolResult> {
    try {
      // Generate code using Gemini
      const { code, thoughts, previewHtml } = await this.generateCode(params);
      
      // Validate security
      const securityCheck = await this.validateSecurity(code, params.securityLevel);
      if (!securityCheck.safe) {
        return this.createResult(false, undefined, `Security validation failed: ${securityCheck.reason}`);
      }

      return this.createResult(true, { 
        code, 
        thoughts,
        previewHtml,
        dependencies: params.dependencies || [],
        language: params.language,
        template: params.template
      }, undefined, { 
        securityLevel: params.securityLevel,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      return this.createResult(false, undefined, error instanceof Error ? error.message : 'Code generation failed');
    }
  }

  private async generateCode(params: CodeGenerationRequest): Promise<{ code: string; thoughts?: string; previewHtml?: string }> {
    const template = this.templates.get(params.template || 'default');
    const prompt = `Generate ${params.language} code based on this description:
    ${params.description}
    
    ${template ? `Use this template structure: ${template}` : ''}
    ${params.dependencies ? `Required dependencies: ${params.dependencies.join(', ')}` : ''}
    
    Requirements:
    - Provide clean, well-documented, production-ready code
    - Follow best practices for ${params.language}
    - Include error handling where appropriate
    - Add inline comments for complex logic
    - Return ONLY the code in markdown code blocks.
    
    SPECIAL INSTRUCTION FOR UI COMPONENTS:
    If the requested code is a UI component (e.g., a button, card, form, dashboard), also provide a separate "PREVIEW" block at the end of your response. 
    The PREVIEW block must be a standalone HTML file content wrapped in \`\`\`html code blocks. 
    It should include all necessary CSS (inline or in <style> tags) to render the component beautifully in an iframe. 
    If you use Tailwind, include the Tailwind CDN script in the <head>.
    
    Structure your response as:
    [MAIN CODE BLOCK]
    [OPTIONAL PREVIEW BLOCK]
    `;

    const response = await this.gemini.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          includeThoughts: true,
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    // Extract thoughts if present
    const thoughts = response.candidates?.[0]?.content?.parts
      ?.filter(part => part.thought)
      ?.map(part => part.text)
      ?.join('\n') || '';

    // Explicitly filter out parts marked as thoughts for the code content
    const content = response.candidates?.[0]?.content?.parts
      ?.filter(part => !part.thought && part.text)
      ?.map(part => part.text)
      ?.join('\n') || '';

    const code = this.extractCodeFromResponse(content || response.text || '');
    const previewHtml = this.extractPreviewFromResponse(content || response.text || '');
    
    return { code, thoughts, previewHtml };
  }

  private extractPreviewFromResponse(response: string): string | undefined {
    // Look for a block specifically marked or just the second html block if it exists
    // We prioritize a block that looks like a full HTML document
    const htmlBlocks = [...response.matchAll(/```html\s*([\s\S]*?)\s*```/g)];
    
    if (htmlBlocks.length > 0) {
      // If there are multiple HTML blocks, the preview is likely the one containing <html> or <style>
      for (const match of htmlBlocks) {
        if (match[1].includes('<html') || match[1].includes('<style') || match[1].includes('<!DOCTYPE')) {
          return match[1].trim();
        }
      }
      // Fallback to the last html block
      return htmlBlocks[htmlBlocks.length - 1][1].trim();
    }
    
    return undefined;
  }

  private extractCodeFromResponse(response: string): string {
    // Remove markdown code blocks if present
    const codeBlockMatch = response.match(/```[\w]*\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    // If no code blocks, return the response as-is
    return response.trim();
  }

  private async validateSecurity(code: string, securityLevel: string): Promise<{safe: boolean, reason?: string}> {
    const dangerousPatterns = [
      { pattern: /eval\s*\(/, description: 'eval() function usage' },
      { pattern: /exec\s*\(/, description: 'exec() function usage' },
      { pattern: /subprocess/i, description: 'subprocess usage' },
      { pattern: /os\.system/i, description: 'os.system usage' },
      { pattern: /shell=True/i, description: 'shell execution' },
      { pattern: /__import__/i, description: 'dynamic imports' },
      { pattern: /file\s*\(/i, description: 'file operations' },
      { pattern: /open\s*\(/i, description: 'file opening' },
      { pattern: /require\s*\(/i, description: 'require() usage' }
    ];

    for (const { pattern, description } of dangerousPatterns) {
      if (pattern.test(code)) {
        const allowed = securityLevel === 'standard';
        return {
          safe: allowed,
          reason: allowed ? undefined : `Potentially dangerous pattern detected: ${description}`
        };
      }
    }

    return { safe: true };
  }

  private loadTemplates() {
    this.templates.set('default', `
// Default template - clean, well-structured code
// Add your implementation here
`);

    this.templates.set('api', `
// API Service template
class ApiService {
  constructor() {
    // Initialize service
  }

  async method() {
    // Implement API logic
  }
}
`);

    this.templates.set('component', `
// React Component template
import React from 'react';

interface Props {
  // Define props
}

export function Component({ }: Props) {
  // Component implementation
  return <div></div>;
}
`);

    this.templates.set('function', `
// Function template
/**
 * Description of the function
 */
function functionName() {
  // Function implementation
}
`);
  }
}
