/**
 * Test script for the Tusky upload API
 * Run with: node scripts/test-upload.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function testUpload() {
  console.log('🧪 Testing Tusky Upload API...\n');

  try {
    // Check if we have a test MP3 file
    const testFile = path.join(__dirname, '../public/test-music.mp3');
    
    if (!fs.existsSync(testFile)) {
      console.log('❌ Test MP3 file not found. Please add a test file at:');
      console.log('   buskers/public/test-music.mp3');
      console.log('\nYou can download a sample MP3 from:');
      console.log('   https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
      return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFile));

    console.log('📤 Uploading test file...');
    console.log('File:', testFile);
    console.log('Size:', fs.statSync(testFile).size, 'bytes');

    // Make the request
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log('\n✅ Upload successful!');
      console.log('Response:', JSON.stringify(result, null, 2));
      
      if (result.uploadId) {
        console.log('\n🔗 Verify upload in Tusky dashboard:');
        console.log('   https://app.tusky.io/files');
        console.log('   Look for vault: "Buskers Music Vault"');
        console.log('   File path:', result.path);
      }
    } else {
      console.log('\n❌ Upload failed!');
      console.log('Status:', response.status);
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Next.js dev server is running (npm run dev)');
    console.log('   2. TUSKY_API_KEY is set in .env.local');
    console.log('   3. Test MP3 file exists in public/ folder');
  }
}

// Run the test
testUpload();
