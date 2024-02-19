require('dotenv').config();

document.addEventListener('DOMContentLoaded', async () => {
    let web3;

    // Function to connect to MetaMask
    async function connectToMetaMask() {
        if (window.ethereum) {
            try {
                // Request MetaMask account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                web3 = new Web3(window.ethereum);

                console.log('Connected to MetaMask');
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            console.error('MetaMask not detected');
        }
    }

    // Function to deploy a smart wallet
    async function deploySmartWallet() {
        const accounts = await web3.eth.getAccounts();
        const proxyContract = new web3.eth.Contract(JSON.parse(process.env.PROXY_CONTRACT_ABI), process.env.PROXY_CONTRACT_ADDRESS);

        try {
            // Call the createSmartWallet function in the proxy contract
            const result = await proxyContract.methods.createSmartWallet().send({ from: accounts[0] });
            console.log('Smart Wallet deployed:', result.events.SmartWalletCreated.returnValues.smartWallet);
        } catch (error) {
            console.error('Error deploying smart wallet:', error);
        }
    }

    // Function to destroy and redeploy a smart wallet
    async function destroyAndRedeploy() {
        const accounts = await web3.eth.getAccounts();
        const proxyContract = new web3.eth.Contract(JSON.parse(process.env.PROXY_CONTRACT_ABI), process.env.PROXY_CONTRACT_ADDRESS);

        try {
            // Call the destroyAndRedeploy function in the proxy contract
            await proxyContract.methods.destroyAndRedeploy().send({ from: accounts[0] });
            console.log('Smart Wallet destroyed and redeployed');
        } catch (error) {
            console.error('Error destroying and redeploying smart wallet:', error);
        }
    }

    // Connect to MetaMask when the Connect button is clicked
    document.getElementById('connectButton').addEventListener('click', connectToMetaMask);

    // Deploy a smart wallet when the Deploy Smart Wallet button is clicked
    document.getElementById('deploySmartWallet').addEventListener('click', deploySmartWallet);

    // Destroy and redeploy a smart wallet when the Destroy and Redeploy button is clicked
    document.getElementById('destroyAndRedeploy').addEventListener('click', destroyAndRedeploy);
});
