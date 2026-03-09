// app/api/generate-code/route.ts - Code Generation API Route

import { NextRequest, NextResponse } from 'next/server';
import { CodeGenerationTool } from '@/lib/tools/code-generation-tool';
import { config } from '@/lib/config/environment';

const codeGenTool = new CodeGenerationTool(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      description, 
      language = 'typescript', 
      template = 'default',
      dependencies = [],
      securityLevel = 'sandboxed'
    } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    const result = await codeGenTool.execute({
      description,
      language,
      template,
      dependencies,
      securityLevel
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Code generation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Code generation failed' },
      { status: 500 }
    );
  }
}
