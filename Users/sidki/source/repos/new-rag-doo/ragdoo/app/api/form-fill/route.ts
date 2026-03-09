// app/api/form-fill/route.ts - Form Filling API Route

import { NextRequest, NextResponse } from 'next/server';
import type { FormFillingTask } from '@/lib/types/agent-types';
import { FormFillingTool } from '@/lib/tools/form-filling-tool';
import { config } from '@/lib/config/environment';
import type { FormQuestion, Filling } from '@/lib/types/agent-types';

const formFillTool = new FormFillingTool(config);

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    const allowedStrategies = ['rag', 'research', 'inference', 'human'] as const;
    type Strategy = typeof allowedStrategies[number];

    let csvData: Record<string, unknown>[] | undefined;
    let targetCompleteness: number = 0.9;
    let strategies: Strategy[] = ['inference'];
    let csvHeaders: string[] = [];
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (file upload)
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }
      
      const text = await file.text();
      
      // Simple CSV parser that handles quoted fields
      function parseCSVLine(line: string): string[] {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        
        result.push(current.trim().replace(/^"|"$/g, ''));
        return result;
      }
      
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      if (lines.length === 0) {
        return NextResponse.json(
          { success: false, error: 'File is empty' },
          { status: 400 }
        );
      }
      csvHeaders = parseCSVLine(lines[0]).map(h => h.trim()).filter(h => h !== '');
      
      console.log('Parsed headers:', csvHeaders);
      
      csvData = lines.slice(1).map((line) => {
        const values = parseCSVLine(line);
        const row: Record<string, string> = {};
        csvHeaders.forEach((header, headerIndex) => {
          row[header] = values[headerIndex] || '';
        });
        return row;
      }).filter(row => Object.values(row).some(val => val && val.toString().trim() !== ''));
    } else {
      // Handle JSON
      const body = (await request.json()) as Partial<FormFillingTask> & Record<string, unknown>;
      csvData = body.csvData as Record<string, unknown>[] | undefined;
      targetCompleteness = typeof body.targetCompleteness === 'number' ? body.targetCompleteness : 0.9;
      const incoming = Array.isArray(body.strategies) ? body.strategies : ['inference'];
      strategies = (incoming as unknown[])
        .filter((s): s is Strategy => typeof s === 'string' && allowedStrategies.includes(s as Strategy));
      if (strategies.length === 0) strategies = ['inference'];
    }

    console.log('Parsed CSV data:', { 
      length: csvData?.length, 
      firstRow: csvData?.[0],
      isArray: Array.isArray(csvData) 
    });

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'CSV data is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    const result = await formFillTool.execute({
      csvData,
      targetCompleteness,
      strategies
    });

    // Transform the result to match frontend expectations
    if (result.success && result.data) {
      const data = result.data as {
        completedData?: Record<string, unknown>[];
        questions?: unknown[];
        autoFilledCells?: unknown[];
        gapAnalysis?: Record<string, unknown>;
      };
      const completedData = (data.completedData as Record<string, unknown>[]) || (csvData as Record<string, unknown>[]);
      const headers = csvHeaders.length > 0 ? csvHeaders : Object.keys(completedData[0] || {});

      // Convert to rows format expected by frontend
      const rows: string[][] = completedData.map((row: Record<string, unknown>) =>
        headers.map((header) => (row[header] as string) || '')
      );

      const totalCells = rows.length * headers.length;
      const filledCells = rows.flat().filter((cell: unknown) => {
        if (cell === null || cell === undefined) return false;
        return cell.toString().trim() !== '';
      }).length;
      const completionRate = totalCells > 0 ? filledCells / totalCells : 0;
      const missingCount = totalCells - filledCells;

      // Find missing cells with their coordinates and match with tool's questions/suggestions
      const missingCells: Array<{ 
        row: number; 
        column: number; 
        header: string;
        question: string;
        context: string;
        suggestion?: string;
        confidence?: number;
      }> = [];

      rows.forEach((row: string[], rowIndex: number) => {
        row.forEach((cell: string, colIndex: number) => {
          if (!cell || cell.toString().trim() === '') {
            const header = headers[colIndex];
            // Find corresponding question or autofilled data
            const question = (data.questions as FormQuestion[])?.find(q => 
              q.cellCoordinates?.row === rowIndex && q.cellCoordinates?.column === colIndex
            );
            const autoFilled = (data.autoFilledCells as Filling[])?.find(af => 
              af.rowIndex === rowIndex && af.columnName === header
            );

            missingCells.push({
              row: rowIndex,
              column: colIndex,
              header,
              question: question?.question || `What is the ${header} for this record?`,
              context: `Row ${rowIndex + 1}, Column ${header}`,
              suggestion: autoFilled?.value || question?.suggestedAnswer,
              confidence: autoFilled?.confidence || 0.5
            });
          }
        });
      });

      return NextResponse.json({
        success: true,
        headers,
        rows,
        totalCells,
        completionRate,
        missingCount,
        missingCells,
        questions: data.questions || [],
        autoFilledCells: data.autoFilledCells || [],
        gapAnalysis: data.gapAnalysis || {}
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Form filling API error:', error);
    return NextResponse.json(
      { success: false, error: 'Form filling failed' },
      { status: 500 }
    );
  }
}
