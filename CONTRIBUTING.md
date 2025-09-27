# Contributing to ENSwap

Thank you for your interest in contributing to ENSwap! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Basic understanding of React, TypeScript, and Solidity
- Familiarity with Web3 and blockchain concepts

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ENSwap-Identity.git
   cd ENSwap-Identity
   ```

2. **Run Setup Script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure Environment**
   - Update `frontend/.env` with your API keys
   - Update `contracts/.env` with your private keys (testnet only)

## 🛠️ Development Workflow

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(identity): add ENS domain validation
fix(swap): resolve token balance calculation
docs(api): update deployment guide
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Frontend tests
   cd frontend
   npm run test
   
   # Contract tests
   cd ../contracts
   npx hardhat test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat(scope): your commit message"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Code Standards

### Frontend (React/TypeScript)

- Use TypeScript for all new code
- Follow React best practices and hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

**Example Component:**
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  onSubmit: (data: any) => void;
}

const ExampleComponent: React.FC<Props> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Loading...' : 'Submit'}
    </Button>
  );
};

export default ExampleComponent;
```

### Smart Contracts (Solidity)

- Follow OpenZeppelin standards
- Use NatSpec documentation
- Implement proper access controls
- Add comprehensive tests

**Example Contract:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ExampleContract
 * @dev Example contract following ENSwap standards
 */
contract ExampleContract is Ownable {
    event ExampleEvent(address indexed user, uint256 value);

    /**
     * @dev Example function with proper documentation
     * @param value The value to process
     */
    function exampleFunction(uint256 value) external onlyOwner {
        require(value > 0, "Value must be greater than 0");
        
        emit ExampleEvent(msg.sender, value);
    }
}
```

## 🧪 Testing Guidelines

### Frontend Testing

- Write unit tests for utility functions
- Test component rendering and user interactions
- Mock external API calls
- Test error handling scenarios

### Smart Contract Testing

- Test all public functions
- Test edge cases and error conditions
- Test access controls
- Use fixtures for test data

**Example Test:**
```javascript
describe("ENSwapIdentity", function () {
  it("Should create identity successfully", async function () {
    const { contract, owner } = await loadFixture(deployContract);
    
    await expect(contract.createIdentity("alice.eth", "did:ethr:0x123"))
      .to.emit(contract, "IdentityCreated")
      .withArgs(owner.address, "alice.eth", "did:ethr:0x123", anyValue);
  });
});
```

## 📚 Documentation

### Code Documentation

- Use JSDoc for TypeScript functions
- Use NatSpec for Solidity functions
- Document complex algorithms
- Include examples in documentation

### README Updates

- Update README when adding new features
- Include setup instructions for new dependencies
- Document breaking changes
- Add screenshots for UI changes

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Operating System
   - Node.js version
   - Browser version (if frontend issue)

2. **Steps to Reproduce**
   - Clear, numbered steps
   - Expected vs actual behavior

3. **Additional Context**
   - Screenshots if applicable
   - Console logs
   - Network requests (if relevant)

## 💡 Feature Requests

For feature requests, please:

1. Check existing issues first
2. Provide clear use case
3. Explain the benefit to users
4. Consider implementation complexity

## 🔒 Security

### Security Guidelines

- Never commit private keys or sensitive data
- Use testnet for development
- Report security issues privately
- Follow secure coding practices

### Reporting Security Issues

Email security issues to: tummapudianurag@gmail.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fixes (if any)

## 🎯 Areas for Contribution

### High Priority
- Bug fixes and stability improvements
- Performance optimizations
- Security enhancements
- Documentation improvements

### Medium Priority
- New features
- UI/UX improvements
- Test coverage
- Code refactoring

### Low Priority
- Nice-to-have features
- Additional integrations
- Advanced configurations

## 📞 Getting Help

- **Discord**: Join our community server
- **GitHub Issues**: For bugs and feature requests
- **Email**: tummapudianurag@gmail.com
- **Documentation**: Check the `docs/` directory

## 🏆 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to maintainer discussions (for significant contributions)

Thank you for contributing to ENSwap! 🚀
