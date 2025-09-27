const { Tusky } = require('@tusky-io/ts-sdk/web');

async function testTusky() {
  try {
    console.log('Testing Tusky SDK...');
    
    const apiKey = '3311a6a5-f561-4868-9819-edd3bd93c57b';
    const tusky = new Tusky({
      apiKey: apiKey,
      baseUrl: 'https://api.tusky.io',
      timeout: 30000,
    });

    console.log('Tusky SDK initialized');

    // Test vault creation
    const vaultName = `Test Vault - ${Date.now()}`;
    console.log('Creating vault:', vaultName);
    
    const { id: vaultId } = await tusky.vault.create(vaultName, { encrypted: false });
    console.log('✅ Vault created successfully with ID:', vaultId);

    console.log('✅ Tusky SDK test completed successfully!');
    
  } catch (error) {
    console.error('❌ Tusky SDK test failed:', error);
    console.error('Error details:', error.message);
  }
}

testTusky();
