// app/api/generate-document/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DocumentGeneratorTool } from '@/lib/tools/document-generator-tool';
import { config } from '@/lib/config/environment';
import type { DocumentGenerationParams } from '@/lib/types/agent-types';

const tool = new DocumentGeneratorTool(config);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<DocumentGenerationParams> & Record<string, unknown>;
    const content = typeof body.content === 'string' ? body.content : '';
    const filename = typeof body.filename === 'string' ? body.filename : '';
    const format = (body.format as 'html' | 'pdf' | 'docx') || 'html';
    const template = typeof body.template === 'string' ? body.template : 'default';
    const customStyles = typeof body.customStyles === 'string' ? body.customStyles : undefined;

    if (!content || !filename) {
      return NextResponse.json({ success: false, error: 'content and filename are required' }, { status: 400 });
    }

    const result = await tool.execute({ content, filename, format, template, customStyles });
    return NextResponse.json(result);
  } catch (error) { 
    console.error('Document generation failed:', error);
    return NextResponse.json({ success: false, error: 'document generation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Generate document endpoint' });
}


