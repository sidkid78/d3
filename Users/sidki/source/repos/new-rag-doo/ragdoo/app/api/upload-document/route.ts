// app/api/upload-document/route.ts - Placeholder
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Upload document not yet implemented' });
}

export async function GET() {
  return NextResponse.json({ message: 'Upload document endpoint' });
}


