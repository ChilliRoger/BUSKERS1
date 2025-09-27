import { NextRequest, NextResponse } from 'next/server';
import { Tusky } from '@tusky-io/ts-sdk/web';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
      return NextResponse.json({ error: 'Please select a valid MP3 file' }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 50MB' }, { status: 400 });
    }

    // Initialize Tusky SDK with API Key
    const apiKey = process.env.TUSKY_API_KEY || '3311a6a5-f561-4868-9819-edd3bd93c57b';
    const tusky = new Tusky({
      apiKey: apiKey,
      baseUrl: 'https://api.tusky.io',
      timeout: 30000,
    });

    // Create a public vault for music files
    const vaultName = `Music Vault - ${new Date().toISOString().split('T')[0]}`;
    const { id: vaultId } = await tusky.vault.create(vaultName, { encrypted: false });

    // Upload file to the vault
    const uploadId = await tusky.file.upload(vaultId, file);

    return NextResponse.json({
      success: true,
      uploadId: uploadId,
      fileName: file.name,
      fileSize: file.size,
      vaultId: vaultId,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
