// app/api/execute-jupyter/route.ts - Placeholder until integrated
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: 'Execute Jupyter endpoint not yet implemented' });
}

export async function GET() {
  return NextResponse.json({ message: 'Execute Jupyter endpoint' });
}


