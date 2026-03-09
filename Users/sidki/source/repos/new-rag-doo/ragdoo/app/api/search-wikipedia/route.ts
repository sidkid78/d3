// app/api/search-wikipedia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ResearchTool } from '@/lib/tools/research-tool';
import { config } from '@/lib/config/environment';

const tool = new ResearchTool(config);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body?.query === 'string' ? body.query : '';
    const maxResults = typeof body?.maxResults === 'number' ? body.maxResults : 5;
    if (!query) {
      return NextResponse.json({ success: false, error: 'query is required' }, { status: 400 });
    }

    const result = await tool.execute({
      query,
      sources: ['wikipedia'],
      filters: { maxResults }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Wikipedia search failed:', error);
    return NextResponse.json({ success: false, error: 'wikipedia search failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Search Wikipedia endpoint' });
}


