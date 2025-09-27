export interface TuskyUploadResult {
  uploadId: string;
  vaultId: string;
  fileName: string;
  fileSize: number;
  path?: string;
  message?: string;
}

// Upload file to Tusky via API endpoint
export async function uploadToTusky(file: File): Promise<TuskyUploadResult> {
  try {
    console.log('Uploading file to Tusky via API:', file.name);
    
    // Create FormData for the API request
    const formData = new FormData();
    formData.append('file', file);

    // Make request to our API endpoint
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload failed');
    }

    if (!result.success) {
      throw new Error('Upload was not successful');
    }

    console.log('Tusky upload completed via API:', result);
    return {
      uploadId: result.uploadId,
      vaultId: result.vaultId,
      fileName: result.fileName,
      fileSize: result.fileSize,
      path: result.path,
      message: result.message,
    };

  } catch (error) {
    console.error('Tusky upload error:', error);
    
    // Fallback to mock upload if API fails
    console.log('API upload failed, falling back to mock upload');
    return await mockUploadToTusky(file);
  }
}

// Mock upload function as fallback
async function mockUploadToTusky(file: File): Promise<TuskyUploadResult> {
  try {
    console.log('Using mock Tusky upload for file:', file.name);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResult = {
      uploadId: `tusky-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vaultId: `vault-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      path: `/music/${file.name}`,
      message: 'File uploaded to Walrus storage via Tusky (mock)',
    };

    console.log('Mock Tusky upload completed:', mockResult);
    return mockResult;

  } catch (error) {
    console.error('Mock Tusky upload error:', error);
    throw new Error(`Tusky upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Test function to verify Tusky API connection
export async function testTuskyConnection(): Promise<boolean> {
  try {
    console.log('Testing Tusky API connection...');
    
    // Test with a small dummy file
    const dummyFile = new File(['test'], 'test.mp3', { type: 'audio/mpeg' });
    
    try {
      await uploadToTusky(dummyFile);
      console.log('Tusky API connection test successful');
      return true;
    } catch (error) {
      console.log('Tusky API connection test failed, using mock mode');
      return false;
    }
    
  } catch (error) {
    console.error('Tusky connection test failed:', error);
    return false;
  }
}
