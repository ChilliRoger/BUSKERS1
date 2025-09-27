import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { uploadId } = await params;
    
    // For now, return a placeholder image with the upload ID
    // In production, you'd fetch the actual image from Tusky/Walrus storage
    const imageUrl = `https://via.placeholder.com/400x400/6366f1/ffffff?text=Album+Cover+${uploadId.slice(-6)}`;
    
    // Redirect to the placeholder image
    return NextResponse.redirect(imageUrl);

  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}
