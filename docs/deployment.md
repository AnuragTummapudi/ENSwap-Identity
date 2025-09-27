# Deployment Guide

This guide covers deploying ENSwap to various networks and environments.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Hedera account (for testnet deployment)
- 1inch API key
- WalletConnect Project ID

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/AnuragTummapudi/ENSwap-Identity.git
cd ENSwap-Identity
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install contract dependencies
cd ../contracts
npm install
```

### 3. Environment Configuration

Create environment files in the respective directories:

**Frontend (.env)**
```env
VITE_ONE_INCH_API_KEY=your_1inch_api_key
VITE_CONTRACT_ADDRESS=0xEe58d185f59e01034527d95FDd85236fa245Ea9f
VITE_PROJECT_ID=your_walletconnect_project_id
```

**Contracts (.env)**
```env
PRIVATE_KEY=your_private_key
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=your_account_id
HEDERA_PRIVATE_KEY=your_private_key
```

## Smart Contract Deployment

### Hedera Testnet

1. **Configure Hardhat**
   ```bash
   cd contracts
   npx hardhat compile
   ```

2. **Deploy Contract**
   ```bash
   npx hardhat run scripts/deploy.js --network hedera-testnet
   ```

3. **Verify Deployment**
   ```bash
   npx hardhat verify --network hedera-testnet CONTRACT_ADDRESS
   ```

### Ethereum Mainnet (Production)

1. **Update Configuration**
   ```javascript
   // hardhat.config.js
   module.exports = {
     networks: {
       mainnet: {
         url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       }
     }
   };
   ```

2. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

## Frontend Deployment

### Development

```bash
cd frontend
npm run dev
```

### Production Build

```bash
cd frontend
npm run build
```

### Deployment Options

#### Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

#### AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload `dist` folder to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## Docker Deployment

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - VITE_ONE_INCH_API_KEY=${ONE_INCH_API_KEY}
      - VITE_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
      - VITE_PROJECT_ID=${PROJECT_ID}

  proxy:
    build: ./proxy
    ports:
      - "3001:3001"
    environment:
      - ONE_INCH_API_KEY=${ONE_INCH_API_KEY}
```

## Monitoring & Analytics

### Smart Contract Monitoring

- **Hedera Explorer**: Monitor transactions and contract interactions
- **Alerts**: Set up alerts for failed transactions
- **Gas Optimization**: Monitor gas usage patterns

### Frontend Monitoring

- **Error Tracking**: Implement Sentry or similar
- **Analytics**: Google Analytics or Mixpanel
- **Performance**: Lighthouse CI for performance monitoring

## Security Considerations

### Smart Contracts
- Use OpenZeppelin security standards
- Implement access controls
- Regular security audits
- Multi-signature wallets for admin functions

### Frontend
- Validate all user inputs
- Use HTTPS in production
- Implement CSP headers
- Regular dependency updates

## Backup & Recovery

### Smart Contract
- Keep deployment scripts and artifacts
- Document all contract addresses
- Maintain private key backups securely

### Frontend
- Version control all code
- Automated backups of environment variables
- Document deployment procedures

## Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check gas limits
   - Verify network configuration
   - Ensure sufficient funds

2. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check environment variables
   - Verify API endpoints

3. **API Integration Issues**
   - Verify API keys
   - Check rate limits
   - Monitor CORS settings

### Support

For deployment issues:
- Check logs in deployment platform
- Verify environment variables
- Test locally first
- Contact support team

## Production Checklist

- [ ] Environment variables configured
- [ ] Smart contracts deployed and verified
- [ ] Frontend built and deployed
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup procedures in place
- [ ] Security measures implemented
- [ ] Performance optimized
- [ ] Documentation updated
