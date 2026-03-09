// app/api/research/route.ts - Research Tool API Route

import { NextRequest, NextResponse } from 'next/server';
import { ResearchTool } from '@/lib/tools/research-tool';
import { config } from '@/lib/config/environment';

const researchTool = new ResearchTool(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, sources = ['arxiv', 'pubmed'], filters = {} } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const result = await researchTool.execute({
      query,
      sources,
      filters: {
        maxResults: 10,
        ...filters
      }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { success: false, error: 'Research failed' },
      { status: 500 }
    );
  }
}
