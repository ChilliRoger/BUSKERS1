import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { uploadId } = await params;
    
    // For now, return a placeholder audio player page
    // In production, you'd fetch the actual audio file from Tusky/Walrus storage
    const audioUrl = `https://via.placeholder.com/400x300/6366f1/ffffff?text=Audio+File+${uploadId.slice(-6)}`;
    
    // Return an HTML page with audio player
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Music NFT - ${uploadId}</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              max-width: 500px;
              width: 100%;
            }
            .audio-icon {
              font-size: 80px;
              margin-bottom: 20px;
            }
            h1 {
              color: #333;
              margin-bottom: 10px;
            }
            .upload-id {
              background: #f0f0f0;
              padding: 10px;
              border-radius: 10px;
              font-family: monospace;
              font-size: 14px;
              margin: 20px 0;
              word-break: break-all;
            }
            .note {
              color: #666;
              font-size: 14px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="audio-icon">🎵</div>
            <h1>Music NFT</h1>
            <p>This NFT contains a music file stored on decentralized storage.</p>
            <div class="upload-id">Audio ID: ${uploadId}</div>
            <p class="note">
              In a full implementation, this would play the actual audio file.<br>
              The audio file is stored at: tusky-walrus://${uploadId}
            </p>
          </div>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200,
    });

  } catch (error) {
    console.error('Failed to serve music:', error);
    return new NextResponse('Music not found or failed to retrieve', { status: 404 });
  }
}
