import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;
    
    // For now, return a simple metadata structure
    // In a real implementation, you'd fetch this from a database
    // or generate it based on the tokenId
    
    const metadata = {
      name: `Music NFT #${tokenId}`,
      description: `A unique music NFT containing audio and album cover artwork. This NFT represents ownership of music and its associated artwork on the decentralized web.`,
      image: `https://via.placeholder.com/400x400/6366f1/ffffff?text=Music+NFT+%23${tokenId}`,
      external_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/nft/${tokenId}`,
      attributes: [
        {
          trait_type: "File Type",
          value: "Audio"
        },
        {
          trait_type: "Format",
          value: "MP3"
        },
        {
          trait_type: "Type",
          value: "Music NFT"
        }
      ]
    };

    return NextResponse.json(metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Metadata API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    );
  }
}
