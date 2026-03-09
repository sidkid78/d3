// lib/tools/document-generator-tool.ts - Document Generator Tool

import { marked } from 'marked';
import type { Tokens } from 'marked';
import { BaseTool } from './base-tool';
import { ToolResult, DocumentGenerationParams } from '@/lib/types/agent-types';
import { EnvironmentConfig } from '@/lib/config/environment';
import fs from 'fs/promises';
import path from 'path';

interface LocalDocumentGenerationResult {
  filename: string;
  url: string;
  size: number;
}

export class DocumentGeneratorTool extends BaseTool {
  private templates: Map<string, string> = new Map();
  private cssStyles: string = '';

  constructor(private config: EnvironmentConfig) {
    super();
    this.loadTemplates();
    this.loadStyles();
  }

  async execute(params: DocumentGenerationParams): Promise<ToolResult> {
    try {
      const { content, filename, format = 'html', template = 'default', customStyles } = params;
      // Convert markdown to HTML
      const htmlContent = await this.convertMarkdownToHtml(content);
      // Apply template and styles
      const styledDocument = await this.applyTemplate(htmlContent, template, customStyles);
      // Generate document based on format
      const result = await this.generateDocument(styledDocument, filename, format);
      return this.createResult(true, {
        filename: result.filename,
        url: result.url,
        format,
        size: result.size
      }, undefined, {
        originalLength: content.length,
        processedLength: styledDocument.length,
        template
      });
    } catch (error) {
      return this.createResult(false, undefined, error instanceof Error ? error.message : 'Document generation failed');
    }
  }

  private async convertMarkdownToHtml(markdown: string): Promise<string> {
    const renderer = new marked.Renderer();

    // Custom code block rendering
    renderer.code = ({ text, lang }) => {
      return `<pre class="code-block"><code class="language-${lang || 'text'}">${this.escapeHtml(text)}</code></pre>`;
    };

    const originalTable = renderer.table?.bind(renderer);
    renderer.table = (token: { header?: string; body?: string } | Tokens.Table) => {
      if (typeof originalTable === 'function') {
        const html = originalTable(token as Tokens.Table);
        return `<div class="table-container">${html}</div>`;
      }
      const t = token as { header?: string; body?: string };
      const header = t?.header ?? '';
      const body = t?.body ?? '';
      return `<div class="table-container"><table class="styled-table">${header}${body}</table></div>`;
    };

    marked.setOptions({
      renderer,
      gfm: true,
      breaks: true
    });

    return marked(markdown) as unknown as string;
  }

  private async applyTemplate(content: string, templateName: string, customStyles?: string): Promise<string> {
    const template = this.templates.get(templateName) || this.templates.get('default')!;
    const styles = `${this.cssStyles}${customStyles || ''}`;

    return template
      .replace('{{CONTENT}}', content)
      .replace('{{STYLES}}', styles)
      .replace('{{TIMESTAMP}}', new Date().toISOString());
  }

  private async generateDocument(content: string, filename: string, format: string): Promise<LocalDocumentGenerationResult> {
    const outputDir = path.join(process.cwd(), 'public', 'generated-docs');

    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    switch (format.toLowerCase()) {
      case 'html':
        return this.generateHtml(content, filename, outputDir);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  private async generateHtml(content: string, filename: string, outputDir: string): Promise<LocalDocumentGenerationResult> {
    const filepath = path.join(outputDir, `${filename}.html`);
    await fs.writeFile(filepath, content, 'utf8');

    const stats = await fs.stat(filepath);
    return {
      filename: `${filename}.html`,
      url: `/generated-docs/${filename}.html`,
      size: stats.size
    };
  }

  private loadTemplates() {
    this.templates.set('default', `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Document</title>
    <style>{{STYLES}}</style>
</head>
<body>
    <div class="document-container">
        <header class="document-header">
            <div class="generated-timestamp">Generated: {{TIMESTAMP}}</div>
        </header>
        <main class="document-content">
            {{CONTENT}}
        </main>
    </div>
</body>
</html>`);
  }

  private loadStyles() {
    this.cssStyles = `
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 20px;
        background-color: #f9f9f9;
      }
      .document-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .document-header {
        border-bottom: 2px solid #e0e0e0;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      .generated-timestamp {
        font-size: 0.9em;
        color: #666;
        text-align: right;
      }
      .document-content h1, .document-content h2, .document-content h3 {
        color: #2c3e50;
        margin-top: 30px;
      }
      .document-content h1 {
        border-bottom: 3px solid #3498db;
        padding-bottom: 10px;
      }
      .code-block {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        padding: 15px;
        overflow-x: auto;
        font-family: 'Monaco', 'Menlo', monospace;
      }
      .table-container {
        overflow-x: auto;
        margin: 20px 0;
      }
      .styled-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ddd;
      }
      .styled-table th, .styled-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .styled-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      blockquote {
        border-left: 4px solid #3498db;
        padding-left: 20px;
        margin: 20px 0;
        font-style: italic;
        color: #666;
      }
    `;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
