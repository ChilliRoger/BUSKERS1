import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('Test API endpoint called');
    
    // Check environment variables
    const envCheck = {
      TUSKY_API_KEY: !!process.env.TUSKY_API_KEY,
      TUSKY_API_KEY_LENGTH: process.env.TUSKY_API_KEY?.length || 0,
      TUSKY_NETWORK: process.env.TUSKY_NETWORK,
      NODE_ENV: process.env.NODE_ENV,
    };
    
    console.log('Environment check:', envCheck);
    
    return NextResponse.json({
      success: true,
      message: 'API endpoint is working',
      timestamp: new Date().toISOString(),
      environment: envCheck,
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}