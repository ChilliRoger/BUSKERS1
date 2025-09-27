import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Test API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    console.log('File received:', file?.name, file?.size);
    
    return NextResponse.json({
      success: true,
      message: 'Test successful',
      fileName: file?.name,
      fileSize: file?.size
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}
