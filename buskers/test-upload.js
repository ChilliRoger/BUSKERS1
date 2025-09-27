// Test upload to debug the issue
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    console.log('Testing upload to /api/upload...');
    
    // Create a test file
    const testContent = 'test audio content';
    const testFile = Buffer.from(testContent);
    
    const formData = new FormData();
    formData.append('file', testFile, {
      filename: 'test.mp3',
      contentType: 'audio/mpeg'
    });
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.ok) {
      console.log('✅ Upload test successful!');
    } else {
      console.log('❌ Upload test failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testUpload();
