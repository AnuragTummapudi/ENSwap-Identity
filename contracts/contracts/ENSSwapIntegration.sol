// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ENSSwapIntegration
 * @dev Enhanced ENS integration for ENSwap - Creative use of ENS for DeFi
 * This contract demonstrates innovative ENS usage by:
 * 1. Minting ENS subnames for swap transactions
 * 2. Creating transaction-specific ENS names
 * 3. Using ENS as a reputation identifier
 */
contract ENSSwapIntegration is Ownable {
    using Strings for uint256;
    
    // Events
    event SwapENSNameCreated(address indexed user, string ensName, bytes32 swapHash, uint256 timestamp);
    event ENSReputationUpdated(address indexed user, string ensName, uint256 newReputation);
    event ENSSubnameMinted(address indexed user, string parentName, string subname);
    
    // Structs
    struct ENSProfile {
        string primaryName;
        string[] subnames;
        uint256 reputationScore;
        uint256 totalSwaps;
        bool isVerified;
    }
    
    struct SwapRecord {
        bytes32 swapHash;
        string ensName;
        uint256 amount;
        string tokenPair;
        uint256 timestamp;
        bool completed;
    }
    
    // State variables
    mapping(address => ENSProfile) public userProfiles;
    mapping(bytes32 => SwapRecord) public swapRecords;
    mapping(string => address) public ensNameToAddress;
    
    string public constant PARENT_DOMAIN = "enswap.eth"; // Main ENS domain for subnames
    uint256 public constant MIN_REPUTATION_FOR_SUBNAME = 100;
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a unique ENS name for a swap transaction
     * This is a creative use case where each swap gets its own ENS subname
     */
    function createSwapENSName(
        string memory _ensName,
        uint256 _amount,
        string memory _tokenPair
    ) external {
        require(bytes(_ensName).length > 0, "ENS name cannot be empty");
        require(ensNameToAddress[_ensName] == address(0), "ENS name already exists");
        
        bytes32 swapHash = keccak256(abi.encodePacked(
            msg.sender,
            _ensName,
            _amount,
            _tokenPair,
            block.timestamp
        ));
        
        // Create swap record
        SwapRecord storage swap = swapRecords[swapHash];
        swap.swapHash = swapHash;
        swap.ensName = _ensName;
        swap.amount = _amount;
        swap.tokenPair = _tokenPair;
        swap.timestamp = block.timestamp;
        swap.completed = false;
        
        // Update user profile
        ENSProfile storage profile = userProfiles[msg.sender];
        if (bytes(profile.primaryName).length == 0) {
            profile.primaryName = _ensName;
        }
        profile.totalSwaps++;
        
        // Mint subname for the swap (simulated - in real implementation would call ENS registry)
        string memory subname = string(abi.encodePacked(
            "swap-",
            Strings.toHexString(uint256(swapHash), 32),
            ".",
            PARENT_DOMAIN
        ));
        
        profile.subnames.push(subname);
        ensNameToAddress[_ensName] = msg.sender;
        
        emit SwapENSNameCreated(msg.sender, _ensName, swapHash, block.timestamp);
        emit ENSSubnameMinted(msg.sender, PARENT_DOMAIN, subname);
    }
    
    /**
     * @dev Complete a swap and update ENS-based reputation
     */
    function completeSwap(bytes32 _swapHash, uint256 _reputationGain) external onlyOwner {
        SwapRecord storage swap = swapRecords[_swapHash];
        require(swap.swapHash != bytes32(0), "Swap not found");
        require(!swap.completed, "Swap already completed");
        
        swap.completed = true;
        
        // Update reputation based on swap success
        ENSProfile storage profile = userProfiles[ensNameToAddress[swap.ensName]];
        profile.reputationScore += _reputationGain;
        
        emit ENSReputationUpdated(ensNameToAddress[swap.ensName], swap.ensName, profile.reputationScore);
    }
    
    /**
     * @dev Get user's ENS profile with all subnames
     */
    function getUserENSProfile(address _user) external view returns (ENSProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * @dev Get all swap records for a user
     */
    function getUserSwaps(address _user) external view returns (SwapRecord[] memory) {
        uint256 count = 0;
        // Count user's swaps
        for (uint256 i = 0; i < userProfiles[_user].subnames.length; i++) {
            count++;
        }
        
        SwapRecord[] memory swaps = new SwapRecord[](count);
        uint256 index = 0;
        
        // In a real implementation, you'd iterate through user's swaps
        // This is a simplified version
        
        return swaps;
    }
    
    /**
     * @dev Verify ENS name ownership (simulated)
     * In real implementation, this would verify against ENS registry
     */
    function verifyENSName(string memory _ensName, address _owner) external onlyOwner {
        require(ensNameToAddress[_ensName] == _owner, "ENS name not owned by user");
        
        ENSProfile storage profile = userProfiles[_owner];
        profile.isVerified = true;
    }
    
    /**
     * @dev Create a reputation-based ENS subname
     * Only users with sufficient reputation can mint subnames
     */
    function mintReputationSubname(string memory _subname) external {
        ENSProfile storage profile = userProfiles[msg.sender];
        require(profile.reputationScore >= MIN_REPUTATION_FOR_SUBNAME, "Insufficient reputation");
        require(profile.isVerified, "ENS name not verified");
        
        string memory fullSubname = string(abi.encodePacked(_subname, ".", PARENT_DOMAIN));
        profile.subnames.push(fullSubname);
        
        emit ENSSubnameMinted(msg.sender, PARENT_DOMAIN, _subname);
    }
    
    /**
     * @dev Get reputation score for ENS-based trading
     */
    function getENSReputationScore(address _user) external view returns (uint256) {
        return userProfiles[_user].reputationScore;
    }
}
