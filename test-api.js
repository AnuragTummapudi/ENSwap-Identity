const https = require('https');

// Test 1inch API directly
function test1inchAPI() {
  const apiKey = '3T7z7yeDMd35XLNZhUrBxBx0qBXm490T';
  const url = 'https://api.1inch.dev/swap/v6.0/1/quote?fromTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&toTokenAddress=0xA0b86a33E6441b8c4C8C0E4a5cF4c4a5cF4c4a5c&amount=1000000000000000000&fromAddress=0xA0BEE4c59d64AC980856F8b10F28f484C8EaC8F5&slippage=1';
  
  const urlObj = new URL(url);
  const options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.pathname + urlObj.search,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
  };

  console.log('Testing 1inch API with:', options);

  const req = https.request(options, (res) => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error:', error);
  });

  req.end();
}

test1inchAPI();
