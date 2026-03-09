// app/api/query/route.ts - Main Orchestrator API Route

import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';
import { config } from '@/lib/config/environment';

const orchestrator = new AgentOrchestrator(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context, options } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    console.log('Processing agent query:', { query, hasContext: !!context });

    const result = await orchestrator.processQuery({ query, context, options });

    console.log('Agent query completed:', { 
      success: result.success, 
      duration: result.metadata?.executionTime 
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Agent query failed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
