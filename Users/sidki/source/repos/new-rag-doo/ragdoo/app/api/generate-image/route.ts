// app/api/generate-image/route.ts - Image Generation API Route

import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationTool } from '@/lib/tools/image-generation-tool';
import { config } from '@/lib/config/environment';
import { ImageGenerationRequest } from '@/lib/types/agent-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ImageGenerationRequest;
    
    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Initialize image generation tool
    const imageGenTool = new ImageGenerationTool(config);
    
    // Generate image
    const result = await imageGenTool.execute(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Image generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      metadata: result.metadata
    });

  } catch (error) {
    console.error('Image generation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Image Generation API',
    supportedModels: [
      'fal-ai/flux-pro/v1.1',
      'fal-ai/flux/dev',
      'fal-ai/flux/schnell',
      'fal-ai/flux-pro/kontext'
    ],
    features: [
      'Text-to-image generation',
      'Image editing with Kontext',
      'Image-to-image variations',
      'Multiple aspect ratios',
      'Quality and style controls'
    ]
  });
}
