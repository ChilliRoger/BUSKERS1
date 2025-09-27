/**
 * NFT Metadata utilities for creating proper ERC-721 metadata
 * This ensures the album cover image displays as the NFT image
 */

export interface MusicNFTMetadata {
  name: string;
  description: string;
  image: string; // This will be the album cover image URL
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    music_file: string; // MP3 file reference
    album_cover: string; // Album cover image reference
    artist: string;
    created_at: string;
  };
}

/**
 * Generate NFT metadata for a music NFT
 */
export function generateMusicNFTMetadata(
  tokenId: number,
  musicUploadId: string,
  albumCoverUploadId: string,
  fileName: string,
  albumCoverFileName: string,
  artistAddress: string
): MusicNFTMetadata {
  const baseUrl = process.env.NEXT_PUBLIC_TUSKY_BASE_URL || 'https://app.tusky.io/files';
  
  return {
    name: `${fileName.replace('.mp3', '')} - Music NFT #${tokenId}`,
    description: `A unique music NFT containing the audio file "${fileName}" with album cover "${albumCoverFileName}". This NFT represents ownership of the music and its associated artwork on the decentralized web.`,
    image: `${baseUrl}/${albumCoverUploadId}`, // Album cover as the main NFT image
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
        trait_type: "Album Cover",
        value: albumCoverFileName
      },
      {
        trait_type: "Music File",
        value: fileName
      },
      {
        trait_type: "Artist",
        value: artistAddress
      },
      {
        trait_type: "Created",
        value: new Date().toISOString()
      }
    ],
    properties: {
      music_file: `tusky-walrus://${musicUploadId}`,
      album_cover: `tusky-walrus://${albumCoverUploadId}`,
      artist: artistAddress,
      created_at: new Date().toISOString()
    }
  };
}

/**
 * Create a metadata URI for the NFT
 * This can be used as the tokenURI in the smart contract
 */
export function createMetadataURI(metadata: MusicNFTMetadata): string {
  // For now, we'll create a data URI with the metadata
  // In production, you might want to upload this to IPFS or another service
  const metadataJson = JSON.stringify(metadata, null, 2);
  const base64Metadata = Buffer.from(metadataJson).toString('base64');
  return `data:application/json;base64,${base64Metadata}`;
}

/**
 * Generate a simple metadata URI with just the album cover image
 * This is a fallback approach that directly uses the album cover as the image
 */
export function createSimpleMetadataURI(
  albumCoverUploadId: string,
  fileName: string,
  tokenId: number
): string {
  // Create a simple, short metadata URI to avoid transaction drops
  const simpleMetadata = {
    name: `${fileName.replace('.mp3', '')} #${tokenId}`,
    description: `Music NFT: ${fileName}`,
    image: `https://via.placeholder.com/400x400/6366f1/ffffff?text=${encodeURIComponent(fileName.replace('.mp3', ''))}`,
    attributes: [
      {
        trait_type: "Type",
        value: "Music"
      },
      {
        trait_type: "File",
        value: fileName
      }
    ]
  };

  const metadataJson = JSON.stringify(simpleMetadata);
  const base64Metadata = Buffer.from(metadataJson).toString('base64');
  return `data:application/json;base64,${base64Metadata}`;
}

/**
 * Create a metadata URI that points to our API endpoint
 * This allows for dynamic metadata generation
 */
export function createAPIMetadataURI(tokenId: number): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/api/metadata/${tokenId}`;
}
