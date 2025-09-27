const express = require('express');
const cors = require('cors');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to make HTTPS requests
function makeHttpsRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ ok: true, data: JSON.parse(data), status: res.statusCode });
          } catch (e) {
            resolve({ ok: true, data: data, status: res.statusCode });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 1inch API proxy endpoint
app.get('/api/quote', async (req, res) => {
  try {
    const { fromTokenAddress, toTokenAddress, amount, fromAddress, slippage } = req.query;
    
    const apiKey = process.env.VITE_ONE_INCH_API_KEY || '3T7z7yeDMd35XLNZhUrBxBx0qBXm490T';
    
    const url = `https://api.1inch.dev/swap/v6.0/1/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}`;
    
    console.log('Proxying request to 1inch:', url);
    console.log('Using API Key:', apiKey ? 'Present' : 'Missing');
    
    const response = await makeHttpsRequest(url, {
      'Authorization': `Bearer ${apiKey}`,
    });

    console.log('1inch API response status:', response.status);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 1inch API proxy: http://localhost:${PORT}/api/quote`);
});
