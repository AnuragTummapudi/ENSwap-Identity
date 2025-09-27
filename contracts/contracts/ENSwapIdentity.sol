// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ENSwapIdentity {
    struct Receipt {
        string ensName;
        string swapDetails;
        uint256 timestamp;
        bytes32 receiptHash;
    }

    struct UserIdentity {
        string ensName;
        string did;
        address wallet;
        uint256 reputationScore;
    }

    mapping(address => UserIdentity) public identities;
    mapping(address => Receipt[]) public userReceipts;
    mapping(address => uint256) public reputationScores;

    event IdentityCreated(address indexed user, string ensName, string did);
    event ReceiptLogged(address indexed user, string ensName, string swapDetails, uint256 timestamp, bytes32 receiptHash);
    event ReputationUpdated(address indexed user, uint256 newScore);

    function createIdentity(string memory _ensName, string memory _did) public {
        require(bytes(identities[msg.sender].ensName).length == 0, "Identity exists!");
        identities[msg.sender] = UserIdentity(_ensName, _did, msg.sender, 0);
        emit IdentityCreated(msg.sender, _ensName, _did);
    }

    function getIdentity(address _user) public view returns (UserIdentity memory) {
        return identities[_user];
    }

    function logReceipt(
        address user,
        string memory ensName,
        string memory swapDetails,
        uint256 timestamp
    ) public {
        bytes32 receiptHash = keccak256(abi.encodePacked(user, ensName, swapDetails, timestamp, block.timestamp));
        
        userReceipts[user].push(Receipt(ensName, swapDetails, timestamp, receiptHash));
        
        // Update reputation score (increment by 1 for each swap)
        reputationScores[user] += 1;
        
        // Update identity reputation if exists
        if (bytes(identities[user].ensName).length > 0) {
            identities[user].reputationScore = reputationScores[user];
        }
        
        emit ReceiptLogged(user, ensName, swapDetails, timestamp, receiptHash);
        emit ReputationUpdated(user, reputationScores[user]);
    }

    function getReceipts(address user) public view returns (Receipt[] memory) {
        return userReceipts[user];
    }

    function getReputationScore(address user) public view returns (uint256) {
        return reputationScores[user];
    }

    // Example swap function (token-to-token swap using ENS + DID identity check)
    function swapTokens(address tokenA, address tokenB, uint256 amount) public {
        require(bytes(identities[msg.sender].ensName).length > 0, "No identity registered!");

        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // For demo: just return tokens back (mock swap)
        require(IERC20(tokenB).transfer(msg.sender, amount), "Return failed");
    }
}
