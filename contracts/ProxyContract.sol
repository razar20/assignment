// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SmartWalletContract.sol";

contract ProxyContract {
    // Counter to track the number of created wallets
    uint256 private walletCounter;

    // Mapping to store user-specific smart wallet contracts
    mapping(address => address) private userWallets;

    // Event emitted when a new smart wallet is created
    event SmartWalletCreated(address indexed user, address smartWallet);

    // Event emitted when a smart wallet is destroyed
    event SmartWalletDestroyed(address indexed user, address smartWallet);

    // Function to create a new smart wallet contract
    function createSmartWallet() external returns (address) {
        // Ensure each user gets a unique smart wallet address
        address user = msg.sender;
        require(userWallets[user] == address(0), "Smart wallet already exists");

        // Increment the counter and create a new smart wallet
        walletCounter++;
        address newSmartWallet = address(new SmartWalletContract());

        // Store the mapping of the user to the smart wallet
        userWallets[user] = newSmartWallet;

        // Emit an event indicating the creation of a new smart wallet
        emit SmartWalletCreated(user, newSmartWallet);

        return newSmartWallet;
    }

    // Function to destroy a specific user's smart wallet and allow redeployment
    function destroyAndRedeploy() external {
        address user = msg.sender;
        address smartWallet = userWallets[user];
        require(smartWallet != address(0), "Smart wallet does not exist");

        // Destroy the smart wallet
        selfdestruct(payable(smartWallet));

        // Reset the mapping for the user
        userWallets[user] = address(0);

        // Emit an event indicating the destruction of the smart wallet
        emit SmartWalletDestroyed(user, smartWallet);

        // Create a new smart wallet for the user
        address newSmartWallet = address(new SmartWalletContract());
        userWallets[user] = newSmartWallet;

        // Emit an event indicating the creation of a new smart wallet
        emit SmartWalletCreated(user, newSmartWallet);
    }

    // Function to get the user's smart wallet address
    function getSmartWallet() external view returns (address) {
        return userWallets[msg.sender];
    }

}
