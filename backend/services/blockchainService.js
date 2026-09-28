const { web3, contract, blockchainAccount, blockchainNetwork } = require('../config/blockchain');

const accountExists = async (accountNumber) => {
    return await contract.methods
        .accountExists(accountNumber)
        .call()
}

/*
 * Convert INR rupees to paise.
 * Example:
 * 100.50 INR -> 10050 paise
 */
const rupeesToPaise = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
        throw new Error('Invalid amount');
    }

    if (Math.round(value * 100) !== value * 100) {
        throw new Error('Amount can have maximum 2 decimal places');
    }

    return Math.round(value * 100).toString();
};

/*
 * Convert blockchain paise back to INR.
 * Example:
 * 10050 paise -> 100.50 INR
 */
const paiseToRupees = (amount) => {
    return Number(amount) / 100;
};


/*
 * Create a customer account on blockchain.
 */
const createCustomerAccount = async (accountNumber) => {
    const exists = await contract.methods
        .accountExists(accountNumber)
        .call();

    if (exists) {
        return {
            alreadyExists: true,
            accountNumber
        };
    }

    const gas = await contract.methods
        .createCustomerAccount(accountNumber)
        .estimateGas({
            from: blockchainAccount.address
        });

    const receipt = await contract.methods
        .createCustomerAccount(accountNumber)
        .send({
            from: blockchainAccount.address,
            gas
        });

    return {
        alreadyExists: false,
        accountNumber,
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber)
    };
};


/*
 * Get customer balance from blockchain.
 */
const getCustomerBalance = async (accountNumber) => {
    const balance = await contract.methods
        .getBalance(accountNumber)
        .call();

    return paiseToRupees(balance);
};


/*
 * Deposit money into customer blockchain account.
 */
const deposit = async (
    accountNumber,
    amount,
    description = 'Cash deposit'
) => {
    const blockchainAmount = rupeesToPaise(amount);

    const gas = await contract.methods
        .deposit(
            accountNumber,
            blockchainAmount,
            description
        )
        .estimateGas({
            from: blockchainAccount.address
        });

    const receipt = await contract.methods
        .deposit(
            accountNumber,
            blockchainAmount,
            description
        )
        .send({
            from: blockchainAccount.address,
            gas
        });

    let blockchainTransactionId = null;

    if (receipt.events?.DepositRecorded) {
        blockchainTransactionId = Number(
            receipt.events.DepositRecorded.returnValues.transactionId
        );
    }

    return {
        blockchainTransactionId,
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        blockchainNetwork,
        amount: Number(amount),
        newBalance: await getCustomerBalance(accountNumber)
    };
};


/*
 * Withdraw money from customer blockchain account.
 */
const withdraw = async (
    accountNumber,
    amount,
    description = 'Cash withdrawal'
) => {
    const blockchainAmount = rupeesToPaise(amount);

    const gas = await contract.methods
        .withdraw(
            accountNumber,
            blockchainAmount,
            description
        )
        .estimateGas({
            from: blockchainAccount.address
        });

    const receipt = await contract.methods
        .withdraw(
            accountNumber,
            blockchainAmount,
            description
        )
        .send({
            from: blockchainAccount.address,
            gas
        });

    let blockchainTransactionId = null;

    if (receipt.events?.WithdrawalRecorded) {
        blockchainTransactionId = Number(
            receipt.events.WithdrawalRecorded.returnValues.transactionId
        );
    }

    return {
        blockchainTransactionId,
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        blockchainNetwork,
        amount: Number(amount),
        newBalance: await getCustomerBalance(accountNumber)
    };
};


/*
 * Transfer money between two customer accounts.
 */
const transfer = async (
    senderAccount,
    receiverAccount,
    amount,
    description = 'Account transfer'
) => {
    const blockchainAmount = rupeesToPaise(amount);

    const gas = await contract.methods
        .transfer(
            senderAccount,
            receiverAccount,
            blockchainAmount,
            description
        )
        .estimateGas({
            from: blockchainAccount.address
        });

    const receipt = await contract.methods
        .transfer(
            senderAccount,
            receiverAccount,
            blockchainAmount,
            description
        )
        .send({
            from: blockchainAccount.address,
            gas
        });

    let blockchainTransactionId = null;

    if (receipt.events?.TransferRecorded) {
        blockchainTransactionId = Number(
            receipt.events.TransferRecorded.returnValues.transactionId
        );
    }

    return {
        blockchainTransactionId,
        transactionHash: receipt.transactionHash,
        blockNumber: Number(receipt.blockNumber),
        blockchainNetwork,
        amount: Number(amount),
        senderBalance: await getCustomerBalance(senderAccount),
        receiverBalance: await getCustomerBalance(receiverAccount)
    };
};


/*
 * Get all blockchain transaction IDs for a customer.
 */
const getCustomerTransactionIds = async (accountNumber) => {
    return await contract.methods
        .getCustomerTransactionIds(accountNumber)
        .call();
};


/*
 * Get total number of transactions stored on blockchain.
 */
const getTransactionCount = async () => {
    return await contract.methods
        .getTransactionCount()
        .call();
};

const setAccountStatus = async (accountNumber, active) => {
    const exists = await contract.methods
        .accountExists(accountNumber)
        .call()

    if (!exists) {
        throw new Error('Blockchain account does not exist')
    }

    const gas = await contract.methods
        .setAccountStatus(accountNumber, active)
        .estimateGas({
            from: blockchainAccount.address
        })

    const receipt = await contract.methods
        .setAccountStatus(accountNumber, active)
        .send({
            from: blockchainAccount.address,
            gas
        })

    return {
        accountNumber,
        active,
        transactionHash: receipt.transactionHash,
        blockchainNetwork,
        blockNumber: Number(receipt.blockNumber)
    }
}

const getTransaction = async (transactionId, transactionHash = null) => {
    const transaction = await contract.methods
        .getTransaction(transactionId)
        .call()

    let blockNumber = null

    // Get block number from the blockchain transaction hash
    if (transactionHash) {
        try {
            const blockchainTx = await web3.eth.getTransaction(transactionHash)

            if (blockchainTx && blockchainTx.blockNumber !== undefined) {
                blockNumber = Number(blockchainTx.blockNumber)
            }
        } catch (error) {
            console.error(
                'Failed to fetch blockchain block number:',
                error.message
            )
        }
    }

    return {
        transactionId: Number(transaction[0]),
        transactionType: transaction[1],
        senderAccount: transaction[2],
        receiverAccount: transaction[3],
        amount: paiseToRupees(transaction[4]),
        description: transaction[5],
        timestamp: Number(transaction[6]),
        blockNumber
    }
}

module.exports = {
    accountExists,
    createCustomerAccount,
    getCustomerBalance,
    deposit,
    withdraw,
    transfer,
    getCustomerTransactionIds,
    getTransactionCount,
    rupeesToPaise,
    paiseToRupees,
    setAccountStatus,
    getTransaction
};