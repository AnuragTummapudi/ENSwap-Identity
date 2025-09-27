const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// 1inch API proxy endpoint
app.get('/api/quote', async (req, res) => {
  try {
    const { fromTokenAddress, toTokenAddress, amount, fromAddress, slippage } = req.query;
    
    const apiKey = process.env.VITE_ONE_INCH_API_KEY || '3T7z7yeDMd35XLNZhUrBxBx0qBXm490T';
    
    const url = `https://api.1inch.dev/swap/v6.0/1/quote?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&fromAddress=${fromAddress}&slippage=${slippage}`;
    
    console.log('Proxying request to 1inch:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`1inch API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
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
