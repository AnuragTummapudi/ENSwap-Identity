# ENSwap API Documentation

## Overview

ENSwap provides a comprehensive API for decentralized identity management and token swapping. The API consists of smart contract functions and 1inch integration for optimal token exchange rates.

## Smart Contract API

### ENSwapIdentity Contract

**Contract Address**: `0xEe58d185f59e01034527d95FDd85236fa245Ea9f`  
**Network**: Hedera Testnet

#### Functions

##### `createIdentity(string memory _ensName, string memory _did) public`

Creates a new decentralized identity for the caller.

**Parameters:**
- `_ensName`: ENS domain name (e.g., "alice.eth")
- `_did`: Decentralized Identifier string

**Events:**
- `IdentityCreated(address indexed user, string ensName, string did, uint256 timestamp)`

**Example:**
```solidity
// Create identity
await contract.createIdentity("alice.eth", "did:ethr:0x123...");
```

##### `getIdentity(address _user) public view returns (UserIdentity)`

Retrieves user identity information.

**Parameters:**
- `_user`: User's wallet address

**Returns:**
```solidity
struct UserIdentity {
    string ensName;        // ENS domain name
    string did;           // Decentralized Identifier
    address wallet;       // Wallet address
    uint256 reputationScore; // Reputation score
}
```

**Example:**
```javascript
const identity = await contract.getIdentity(userAddress);
console.log(identity.ensName); // "alice.eth"
console.log(identity.reputationScore); // 100
```

##### `logReceipt(address user, string memory ensName, string memory swapDetails, uint256 timestamp) public`

Logs a transaction receipt for reputation tracking.

**Parameters:**
- `user`: User's wallet address
- `ensName`: ENS domain name
- `swapDetails`: Transaction details string
- `timestamp`: Unix timestamp

**Events:**
- `ReceiptLogged(address indexed user, string ensName, bytes32 receiptHash, uint256 timestamp)`

##### `getReceipts(address user) public view returns (Receipt[])`

Retrieves all receipts for a user.

**Returns:**
```solidity
struct Receipt {
    string ensName;        // ENS domain name
    string swapDetails;    // Transaction details
    uint256 timestamp;     // Unix timestamp
    bytes32 receiptHash;   // Unique receipt hash
}
```

##### `getReputationScore(address user) public view returns (uint256)`

Gets the reputation score for a user based on transaction history.

**Returns:**
- `uint256`: Reputation score (0-1000)

## 1inch API Integration

### Quote Endpoint

Get optimal swap quotes using 1inch API.

**Endpoint:** `https://api.1inch.dev/swap/v6.1/1/quote`

**Parameters:**
- `fromTokenAddress`: Source token contract address
- `toTokenAddress`: Destination token contract address
- `amount`: Amount to swap (in smallest unit)
- `fromAddress`: User's wallet address
- `slippage`: Slippage tolerance (default: 1%)

**Example:**
```javascript
const quote = await oneInchService.getQuote({
  fromToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
  toToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
  amount: "1000000000000000000", // 1 ETH
  fromAddress: "0x...",
  slippage: 1
});
```

### Swap Endpoint

Get transaction data for executing swaps.

**Endpoint:** `https://api.1inch.dev/swap/v6.1/1/swap`

**Parameters:**
- `src`: Source token address
- `dst`: Destination token address
- `amount`: Amount to swap
- `from`: User's wallet address
- `slippage`: Slippage tolerance

**Example:**
```javascript
const swapData = await oneInchService.getSwapData({
  fromToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  toToken: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  amount: "1000000000000000000",
  fromAddress: "0x...",
  slippage: 1
});

// Execute transaction
const tx = await signer.sendTransaction(swapData.tx);
```

## Error Handling

### Common Error Codes

- `400`: Bad Request - Invalid parameters
- `401`: Unauthorized - Invalid API key
- `404`: Not Found - Resource not found
- `429`: Rate Limited - Too many requests

### Smart Contract Errors

- `IdentityAlreadyExists`: User already has an identity
- `InvalidENSName`: ENS name format is invalid
- `InsufficientBalance`: Not enough tokens for swap

## Rate Limits

- 1inch API: 300 requests per minute
- Smart Contract: No rate limits (gas-based)

## Authentication

### 1inch API
Include your API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

### Smart Contract
Transactions require wallet connection and gas fees.

## Examples

### Complete Swap Flow

```javascript
// 1. Check if user has identity
const identity = await contract.getIdentity(userAddress);
if (!identity.ensName) {
  // Create identity first
  await contract.createIdentity("alice.eth", "did:ethr:0x123...");
}

// 2. Get quote
const quote = await oneInchService.getQuote({
  fromToken: ETH_ADDRESS,
  toToken: USDC_ADDRESS,
  amount: "1000000000000000000",
  fromAddress: userAddress,
  slippage: 1
});

// 3. Get swap data
const swapData = await oneInchService.getSwapData({
  fromToken: ETH_ADDRESS,
  toToken: USDC_ADDRESS,
  amount: "1000000000000000000",
  fromAddress: userAddress,
  slippage: 1
});

// 4. Execute swap
const tx = await signer.sendTransaction(swapData.tx);
await tx.wait();

// 5. Log receipt
await contract.logReceipt(
  userAddress,
  identity.ensName,
  `Swapped 1 ETH for ${quote.toAmount} USDC`,
  Math.floor(Date.now() / 1000)
);
```
