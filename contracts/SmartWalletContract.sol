// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SmartWalletContract {
    // Owner of the smart wallet
    address private owner;

    // Modifier to ensure only the owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to delegate calls to other contracts
    function delegateCall(address target, bytes memory data) external onlyOwner returns (bytes memory) {
        // Use low-level delegatecall to forward the call
        (bool success, bytes memory result) = target.delegatecall(data);

        require(success, "Delegate call failed");
        return result;
    }

    // Functionality to interact with other contracts, send, and receive funds

    // Send funds to a specific address
    function sendFunds(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        recipient.transfer(amount);
    }

    // Receive funds
    receive() external payable {}

    // Function to get the smart wallet balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

}
