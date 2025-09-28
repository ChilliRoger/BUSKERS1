// Test Tusky API Configuration
// Run this script to test if the Tusky API is working

const testTuskyAPI = async () => {
  console.log('Testing Tusky API configuration...');
  
  // Test 1: Check if API endpoint is accessible
  try {
    const response = await fetch('/api/test', {
      method: 'GET',
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ API endpoint accessible:', result);
    } else {
      console.log('❌ API endpoint not accessible:', response.status);
    }
  } catch (error) {
    console.log('❌ API endpoint error:', error.message);
  }
  
  // Test 2: Check environment variables
  console.log('Environment variables:');
  console.log('- TUSKY_API_KEY exists:', !!process.env.TUSKY_API_KEY);
  console.log('- TUSKY_NETWORK:', process.env.TUSKY_NETWORK);
  
  // Test 3: Test upload endpoint with dummy data
  try {
    const dummyFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', dummyFile);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload endpoint working:', result);
    } else {
      const error = await response.json();
      console.log('❌ Upload endpoint error:', error);
    }
  } catch (error) {
    console.log('❌ Upload test failed:', error.message);
  }
};

// Run the test
testTuskyAPI();
