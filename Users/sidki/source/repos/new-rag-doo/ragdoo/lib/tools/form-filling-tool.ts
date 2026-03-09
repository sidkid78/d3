// lib/tools/form-filling-tool.ts - Form Filling Tool with Gap Analysis

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { BaseTool } from './base-tool';
import { ToolResult, FormFillingTask, GapAnalysis, FormQuestion } from '@/lib/types/agent-types';

interface Gap {
  rowIndex: number;
  columnIndex: number;
  columnName: string;
  rowData: Record<string, unknown>;
  context: { availableFields: string[]; similarRows: Record<string, unknown>[] };
}

interface Filling {
  rowIndex: number;
  columnName: string;
  value: string;
  confidence: number;
  method: string;
}

interface Pattern {
  dataType: string;
  commonValues: unknown[];
  examples: unknown[];
  fillRate: number;
}
import { EnvironmentConfig } from '@/lib/config/environment';

export class FormFillingTool extends BaseTool {
  private gemini: GoogleGenAI;

  constructor(private config: EnvironmentConfig) {
    super();
    this.gemini = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }

  async execute(params: FormFillingTask): Promise<ToolResult> {
    try {
      // Analyze gaps in the data
      const gapAnalysis = await this.analyzeGaps(params.csvData);
      
      // Attempt intelligent completion using available strategies
      const completionResults = await this.attemptCompletion(
        params.csvData,
        gapAnalysis, 
        params.strategies
      );

      // Generate questions for remaining gaps
      const questions = await this.generateQuestions(
        completionResults.remainingGaps
      );

      return this.createResult(true, {
        originalData: params.csvData,
        completedData: completionResults.data,
        questions,
        completeness: this.calculateCompleteness(completionResults.data),
        autoFilledCells: completionResults.autoFilled,
        gapAnalysis: {
          totalGaps: gapAnalysis.gaps.length,
          completeness: gapAnalysis.completeness
        }
      }, undefined, {
        totalGaps: gapAnalysis.gaps.length,
        autoFilled: completionResults.autoFilled.length,
        questionsGenerated: questions.length
      });
    } catch (error) {
      return this.createResult(false, undefined, error instanceof Error ? error.message : 'Form filling failed');
    }
  }

  private async analyzeGaps(data: Record<string, unknown>[]): Promise<GapAnalysis> {
    if (!data || data.length === 0) {
      return { gaps: [], patterns: new Map(), totalCells: 0, completeness: 1 };
    }

    // Ensure data has valid structure
    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== 'object') {
      console.error('Invalid data structure - first row is not an object:', firstRow);
      return { gaps: [], patterns: new Map(), totalCells: 0, completeness: 1 };
    }

    const gaps: Array<{
      rowIndex: number;
      columnIndex: number;
      columnName: string;
      rowData: Record<string, unknown>;
      context: unknown;
    }> = [];
    const headers = Object.keys(firstRow);

    data.forEach((row, rowIndex) => {
      headers.forEach((column, colIndex) => {
        if (!row[column] || row[column].toString().trim() === '') {
          gaps.push({
            rowIndex,
            columnIndex: colIndex,
            columnName: column,
            rowData: { ...row },
            context: this.extractRowContext(row, data)
          });
        }
      });
    });

    return {
      gaps,
      patterns: this.identifyPatterns(data),
      totalCells: data.length * headers.length,
      completeness: ((data.length * headers.length) - gaps.length) / (data.length * headers.length)
    };
  }

  private extractRowContext(row: Record<string, unknown>, allData: Record<string, unknown>[]): unknown {
    // Extract context from the current row and similar rows
    const context = {
      availableFields: Object.keys(row).filter(key => row[key] && row[key].toString().trim() !== ''),
      similarRows: allData.filter(r => 
        Object.keys(r).some(key => r[key] === row[key] && row[key])
      ).slice(0, 3) // Limit to 3 similar rows for context
    };
    
    return context;
  }

  private identifyPatterns(data: Record<string, unknown>[]): Map<string, unknown> {
    const patterns = new Map();
    
    if (!data.length) return patterns;
    
    const headers = Object.keys(data[0]);
    
    headers.forEach(header => {
      const values = data.map(row => row[header]).filter(v => v);
      const dataType = this.inferDataType(header, values);
      const commonValues = this.findCommonValues(values);
      
      patterns.set(header, {
        dataType,
        commonValues: commonValues.slice(0, 5), // Top 5 common values
        fillRate: values.length / data.length,
        examples: values.slice(0, 3)
      });
    });
    
    return patterns;
  }

  private inferDataType(columnName: string, values: unknown[]): string {
    if (!values.length) return 'text';
    
    const lowerName = columnName.toLowerCase();
    
    if (lowerName.includes('email')) return 'email';
    if (lowerName.includes('phone')) return 'phone';
    if (lowerName.includes('date')) return 'date';
    if (lowerName.includes('age') || lowerName.includes('count')) return 'number';
    if (lowerName.includes('url') || lowerName.includes('website')) return 'url';
    
    // Analyze actual values
    const sampleValues = values.slice(0, 10);
    
    if (sampleValues.every(v => !isNaN(Number(v)))) return 'number';
    if (sampleValues.every(v => /^\d{4}-\d{2}-\d{2}/.test(v as string))) return 'date';
    if (sampleValues.every(v => /@/.test(v as string))) return 'email';
    
    return 'text';
  }

  private findCommonValues(values: unknown[]): unknown[] {
    const frequency = new Map();
    
    values.forEach(value => {
      frequency.set(value, (frequency.get(value) || 0) + 1);
    });
    
    return Array.from(frequency.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([value]) => value);
  }

  private async attemptCompletion(originalData: Record<string, unknown>[], analysis: GapAnalysis, strategies: string[]): Promise<{
    data: Record<string, unknown>[];
    autoFilled: unknown[];
    remainingGaps: Record<string, unknown>[];
  }> {
    const results = {
      data: JSON.parse(JSON.stringify(originalData)),
      autoFilled: [] as unknown[],
      remainingGaps: [...analysis.gaps]
    };

    for (const strategy of strategies) {
      if (strategy === 'inference' && results.remainingGaps.length > 0) {
        const inferenceResults = await this.fillUsingInference(results.remainingGaps, analysis.patterns);
        this.applyFillings(results, inferenceResults as unknown as Filling[]);
      }
      
      // Other strategies would be implemented here (RAG, research, etc.)
    }

    return results;
  }

  private async fillUsingInference(gaps: Record<string, unknown>[], patterns: Map<string, unknown>): Promise<unknown[]> {
    const fillings = [];
    
    for (const gap of gaps.slice(0, 5)) { // Limit to prevent excessive API calls
      try {
        const pattern = patterns.get((gap as unknown as Gap).columnName) as Pattern;
        if (!pattern) continue;

        const prompt = `Infer a value for the missing "${(gap as unknown as Gap).columnName}" field based on this context:
        Row data: ${JSON.stringify((gap as unknown as Gap).rowData)}
        Column pattern: ${JSON.stringify({
          dataType: pattern.dataType,
          commonValues: pattern.commonValues,
          examples: pattern.examples
        })}
        
        Return only the inferred value, nothing else. If you cannot infer a reasonable value, return "CANNOT_INFER".`;

        const response = await this.gemini.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: {
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            }
          }
        });

        const inferredValue = (response.text || '').trim();
        
        if (inferredValue !== 'CANNOT_INFER' && inferredValue.length > 0) {
          fillings.push({
            rowIndex: gap.rowIndex,
            columnName: gap.columnName,
            value: inferredValue,
            confidence: 0.7,
            method: 'inference'
          });
        }
      } catch (error) {
        console.warn(`Inference failed for ${gap.columnName}:`, error);
      }
    }
    
    return fillings;
  }

  private applyFillings(results: { data: Record<string, unknown>[]; autoFilled: unknown[]; remainingGaps: Record<string, unknown>[] }, fillings: Filling[]) {
    fillings.forEach(filling => {
      const row = results.data[filling.rowIndex];
      if (row) {
        row[filling.columnName] = filling.value;
        results.autoFilled.push(filling);
        
        // Remove from remaining gaps
        results.remainingGaps = results.remainingGaps.filter((gap) => 
          !((gap as unknown as Gap).rowIndex === filling.rowIndex && (gap as unknown as Gap).columnName === filling.columnName)
        );
      }
    });
  }

  private async generateQuestions(gaps: Record<string, unknown>[]): Promise<FormQuestion[]> {
    const questions = [];
    
    // Limit questions to prevent overwhelming the user
    const limitedGaps = gaps.slice(0, 10);
    
    for (const gap of limitedGaps) {
      try {
        const prompt = `Generate a specific, actionable question to fill this missing data:
        Column: ${(gap as unknown as Gap).columnName}
        Row context: ${JSON.stringify((gap as unknown as Gap).context.availableFields)}
        Data type: ${this.inferDataType((gap as unknown as Gap).columnName, [])}
        
        Return a JSON object with:
        - question: A clear, specific question
        - suggestedAnswerType: The expected answer format
        - validationRules: Basic validation rules
        
        Make the question conversational and easy to understand.`;

        const response = await this.gemini.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW
            }
          },
        });

        const questionData = JSON.parse(response.text || '{}');
        questions.push({
          ...questionData,
          cellCoordinates: { row: gap.rowIndex, column: gap.columnIndex },
          priority: this.calculateQuestionPriority(gap)
        });
      } catch (error) {
        console.warn(`Question generation failed for ${gap.columnName}:`, error);
        // Fallback question
        questions.push({
          question: `What is the ${gap.columnName} for this record?`,
          suggestedAnswerType: 'text',
          validationRules: {},
          cellCoordinates: { row: gap.rowIndex, column: gap.columnIndex },
          priority: 0.5
        });
      }
    }

    return questions.sort((a, b) => b.priority - a.priority);
  }

  private calculateQuestionPriority(gap: Record<string, unknown>): number {
    let priority = 0.5;
    
    // Higher priority for important-looking columns
    const importantColumns = ['name', 'email', 'id', 'title', 'status'];
    if (importantColumns.some(col => (gap as unknown as Gap).columnName.toLowerCase().includes(col))) {
      priority += 0.3;
    }
    
    // Higher priority if we have good context
    if ((gap as unknown as Gap).context.availableFields.length > 3) {
      priority += 0.2;
    }
    
    return Math.min(priority, 1.0);
  }

  private calculateCompleteness(data: Record<string, unknown>[]): number {
    if (!data.length) return 0;
    
    const headers = Object.keys(data[0]);
    const totalCells = data.length * headers.length;
    
    let filledCells = 0;
    data.forEach(row => {
      headers.forEach(header => {
        if (row[header] && row[header].toString().trim() !== '') {
          filledCells++;
        }
      });
    });
    
    return filledCells / totalCells;
  }
}
