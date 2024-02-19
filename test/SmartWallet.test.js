const { expect } = require('chai');

describe('SmartWalletContract', function () {
    let SmartWalletContract;
    let smartWallet;
    let owner;
    let user1;

    beforeEach(async () => {
        [owner, user1] = await ethers.getSigners();

        // Deploy SmartWalletContract
        const SmartWalletContractFactory = await ethers.getContractFactory('SmartWalletContract');
        smartWallet = await SmartWalletContractFactory.deploy();
        await smartWallet.deployed();
    });

    it('Should deploy SmartWalletContract and set owner correctly', async () => {
        expect(await smartWallet.owner()).to.equal(owner.address);
    });

    it('Should delegate call successfully', async () => {
        const targetContractFactory = await ethers.getContractFactory(''); // Replace with the actual target contract
        const targetContract = await targetContractFactory.deploy();
        await targetContract.deployed();

        const data = targetContract.interface.encodeFunctionData(''); // Replace with the actual function you want to call

        // Delegate call to the target contract
        await expect(smartWallet.delegateCall(targetContract.address, data))
            .to.emit(smartWallet, '') // Replace with the expected event
            .withArgs(/* Expected arguments */);
    });

    it('Should send and receive funds correctly', async () => {
        const initialBalance = await owner.getBalance();
        const amountToSend = ethers.utils.parseEther('1.0');

        // Send funds to the smart wallet
        await owner.sendTransaction({ to: smartWallet.address, value: amountToSend });

        // Check if the smart wallet balance is updated
        expect(await smartWallet.getBalance()).to.equal(amountToSend);

        // Receive funds from the smart wallet
        await expect(() => smartWallet.sendFunds(owner.address, amountToSend))
            .to.changeBalance(owner, amountToSend);

        // Check if the smart wallet balance is updated
        expect(await smartWallet.getBalance()).to.equal(0);

        // Check if the owner balance is updated
        expect(await owner.getBalance()).to.be.above(initialBalance);
    });

    it('Should add funds to the wallet and update balance correctly', async () => {
        const initialBalance = await smartWallet.getBalance();
        const amountToAdd = ethers.utils.parseEther('1.0');

        // Add funds to the smart wallet
        await expect(() => owner.sendTransaction({ to: smartWallet.address, value: amountToAdd }))
            .to.changeBalance(smartWallet, amountToAdd);

        // Check if the smart wallet balance is updated
        expect(await smartWallet.getBalance()).to.equal(initialBalance.add(amountToAdd));
    });

    it('Should transfer funds from the wallet to another address and update balances correctly', async () => {
        const initialBalance = await smartWallet.getBalance();
        const amountToSend = ethers.utils.parseEther('0.5');

        // Add funds to the smart wallet
        await owner.sendTransaction({ to: smartWallet.address, value: amountToSend });

        // Transfer funds from the smart wallet to another address
        const recipientBalanceBefore = await user1.getBalance();
        await expect(() => smartWallet.sendFunds(user1.address, amountToSend))
            .to.changeBalance(smartWallet, -amountToSend)
            .and.changeBalance(user1, amountToSend);

        // Check if the smart wallet balance is updated
        expect(await smartWallet.getBalance()).to.equal(initialBalance.sub(amountToSend));

        // Check if the recipient's balance is updated
        expect(await user1.getBalance()).to.equal(recipientBalanceBefore.add(amountToSend));
    });

    it('Should destroy the wallet, send funds to the destroyed wallet address, recreate the wallet, and recover funds correctly', async () => {
        const initialBalance = await smartWallet.getBalance();
        const amountToSend = ethers.utils.parseEther('0.8');

        // Destroy the smart wallet
        await smartWallet.destroySmartWallet();

        // Attempt to send funds to the destroyed wallet address
        await expect(owner.sendTransaction({ to: smartWallet.address, value: amountToSend }))
            .to.be.revertedWith('Smart wallet does not exist');

        // Recreate the smart wallet
        const SmartWalletContractFactory = await ethers.getContractFactory('SmartWalletContract');
        smartWallet = await SmartWalletContractFactory.deploy();
        await smartWallet.deployed();

        // Recover funds in the new wallet
        const recoveredBalance = await smartWallet.getBalance();
        expect(recoveredBalance).to.equal(initialBalance);

        // Send funds to the new smart wallet address
        await expect(() => owner.sendTransaction({ to: smartWallet.address, value: amountToSend }))
            .to.changeBalance(smartWallet, amountToSend);
    });

});
