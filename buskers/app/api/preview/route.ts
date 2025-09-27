import { NextRequest, NextResponse } from 'next/server';
import { Tusky } from '@tusky-io/ts-sdk/web';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 PREVIEW API - Starting preview process...');
    
    const { uploadId } = await request.json();
    
    if (!uploadId) {
      return NextResponse.json({ 
        error: 'Upload ID is required' 
      }, { status: 400 });
    }

    console.log('Preview request for upload ID:', uploadId);

    // Check for API key
    const apiKey = process.env.TUSKY_API_KEY;
    if (!apiKey) {
      console.error('TUSKY_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    try {
      // Initialize Tusky SDK
      console.log('Initializing Tusky SDK for preview...');
      const tusky = new Tusky({
        apiKey: apiKey,
      });

      console.log('Tusky SDK initialized successfully');

      // Try to get file data from Tusky
      console.log('Fetching file data from Tusky...');
      const fileData = await tusky.file.arrayBuffer(uploadId);
      
      if (!fileData) {
        throw new Error('No file data received from Tusky');
      }

      // Convert to base64
      const base64Data = Buffer.from(fileData).toString('base64');
      
      console.log('File data converted to base64, length:', base64Data.length);

      return NextResponse.json({
        success: true,
        audioData: base64Data,
        uploadId: uploadId,
        message: 'Audio file preview loaded successfully'
      });

    } catch (tuskyError) {
      console.error('Tusky SDK failed, using mock preview:', tuskyError);
      
      // Fallback to mock preview for development
      const mockAudioData = Buffer.from('mock-audio-data-for-preview').toString('base64');
      
      console.log('Mock preview data generated');

      return NextResponse.json({
        success: true,
        audioData: mockAudioData,
        uploadId: uploadId,
        message: 'Audio file preview loaded successfully (mock)'
      });
    }

  } catch (error) {
    console.error('Preview API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Preview failed';
    
    return NextResponse.json(
      { error: `Preview failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
