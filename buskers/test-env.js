// Test script to verify environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables Test:');
console.log('========================');
console.log('TUSKY_API_KEY exists:', !!process.env.TUSKY_API_KEY);
console.log('TUSKY_API_KEY length:', process.env.TUSKY_API_KEY?.length || 0);
console.log('TUSKY_NETWORK:', process.env.TUSKY_NETWORK);
console.log('MUSIC_NFT_CONTRACT_ADDRESS:', process.env.NEXT_PUBLIC_MUSIC_NFT_CONTRACT_ADDRESS);
console.log('KADENA_EXPLORER_BASE_URL:', process.env.NEXT_PUBLIC_KADENA_EXPLORER_BASE_URL);

if (process.env.TUSKY_API_KEY) {
  console.log('\n✅ TUSKY_API_KEY is properly configured');
} else {
  console.log('\n❌ TUSKY_API_KEY is missing');
}
