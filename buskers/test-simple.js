// Simple test for the test API
const FormData = require('form-data');

async function testSimple() {
  try {
    console.log('Testing simple API...');
    
    const testContent = 'test audio content';
    const testFile = Buffer.from(testContent);
    
    const formData = new FormData();
    formData.append('file', testFile, {
      filename: 'test.mp3',
      contentType: 'audio/mpeg'
    });
    
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testSimple();
