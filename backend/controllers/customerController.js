const Customer = require('../models/Customer')
const Transaction = require('../models/Transaction')
const bcrypt = require('bcryptjs')

const {
    accountExists,
    transfer: blockchainTransfer,
    getCustomerBalance
} = require('../services/blockchainService')


/*
 * Transfer money from logged-in customer to another customer
 */
const transferMoney = async (req, res) => {
    try {
        const senderId = req.userId

        const {
            receiverAccount,
            amount,
            description
        } = req.body

        // Validate input
        if (
            !receiverAccount ||
            amount === undefined ||
            amount === null
        ) {
            return res.status(400).json({
                message:
                    'Receiver account and amount are required'
            })
        }

        const transferAmount = Number(amount)

        if (
            !Number.isFinite(transferAmount) ||
            transferAmount <= 0
        ) {
            return res.status(400).json({
                message: 'Invalid transfer amount'
            })
        }

        // Only allow 2 decimal places
        if (
            Math.round(transferAmount * 100) !==
            transferAmount * 100
        ) {
            return res.status(400).json({
                message:
                    'Amount can have maximum 2 decimal places'
            })
        }

        const transactionDescription =
            description?.trim() || 'Money transfer'

        // Find sender
        const sender =
            await Customer.findById(senderId)

        if (!sender) {
            return res.status(404).json({
                message: 'Sender account not found'
            })
        }

        // Check sender status
        if (sender.accountStatus !== 'Active') {
            return res.status(403).json({
                message:
                    'Sender account is not active'
            })
        }

        // Find receiver
        const receiver =
            await Customer.findOne({
                accountNumber:
                    receiverAccount.trim()
            })

        if (!receiver) {
            return res.status(404).json({
                message:
                    'Receiver account not found'
            })
        }

        // Prevent self-transfer
        if (sender._id.equals(receiver._id)) {
            return res.status(400).json({
                message:
                    'You cannot transfer money to your own account'
            })
        }

        // Check receiver status
        if (receiver.accountStatus !== 'Active') {
            return res.status(403).json({
                message:
                    'Receiver account is not active'
            })
        }

        // Check sender blockchain account
        const senderBlockchainExists =
            await accountExists(
                sender.accountNumber
            )

        if (!senderBlockchainExists) {
            return res.status(400).json({
                message:
                    'Sender blockchain account does not exist'
            })
        }

        // Check receiver blockchain account
        const receiverBlockchainExists =
            await accountExists(
                receiver.accountNumber
            )

        if (!receiverBlockchainExists) {
            return res.status(400).json({
                message:
                    'Receiver blockchain account does not exist'
            })
        }

        /*
         * Blockchain is the source of truth.
         */
        const senderBalance =
            await getCustomerBalance(
                sender.accountNumber
            )

        if (senderBalance < transferAmount) {
            return res.status(400).json({
                message: 'Insufficient balance'
            })
        }

        /*
         * Create application transaction first.
         */
        const transaction =
            await Transaction.create({
                transactionId:
                    'TXN' +
                    Date.now() +
                    Math.floor(
                        Math.random() * 1000
                    ),

                sender:
                    sender._id,

                receiver:
                    receiver._id,

                senderAccount:
                    sender.accountNumber,

                receiverAccount:
                    receiver.accountNumber,

                amount:
                    transferAmount,

                type:
                    'Transfer',

                description:
                    transactionDescription,

                status:
                    'Pending',

                timestamp:
                    new Date()
            })

        /*
         * IMPORTANT:
         *
         * Only this try/catch handles blockchain failure.
         */
        let blockchainResult

        try {
            blockchainResult =
                await blockchainTransfer(
                    sender.accountNumber,
                    receiver.accountNumber,
                    transferAmount,
                    transactionDescription
                )

        } catch (blockchainError) {
            console.error(
                'Blockchain transfer error:',
                blockchainError
            )

            /*
             * Blockchain did NOT complete.
             * Mark MongoDB transaction as Failed.
             */
            try {
                transaction.status = 'Failed'
                await transaction.save()
            } catch (mongoError) {
                console.error(
                    'Failed to mark transfer as Failed:',
                    mongoError
                )
            }

            return res.status(400).json({
                message:
                    blockchainError.message ||
                    'Blockchain transfer failed'
            })
        }

        /*
         * IMPORTANT:
         *
         * Reaching this point means the blockchain
         * transaction succeeded.
         *
         * Do NOT put this inside the blockchain
         * try/catch.
         */
        try {
            transaction.status =
                'Completed'

            transaction.blockchainTransactionId =
                blockchainResult.blockchainTransactionId

            transaction.blockchainHash =
                blockchainResult.transactionHash

            transaction.blockNumber =
                Number(
                    blockchainResult.blockNumber
                )

            transaction.blockchainNetwork =
                blockchainResult.blockchainNetwork

            await transaction.save()

        } catch (mongoError) {
            /*
             * Blockchain succeeded but MongoDB update failed.
             *
             * DO NOT mark transaction as Failed.
             *
             * The money has already moved on blockchain.
             * Keep the transaction Pending for reconciliation.
             */
            console.error(
                'MongoDB update failed after blockchain transfer:',
                mongoError
            )

            return res.status(500).json({
                message:
                    'Transfer completed on blockchain, but the transaction record could not be updated. Reconciliation is required.',

                transactionId:
                    transaction.transactionId,

                blockchainTransactionId:
                    blockchainResult.blockchainTransactionId,

                blockchainHash:
                    blockchainResult.transactionHash,

                blockNumber:
                    Number(
                        blockchainResult.blockNumber
                    ),

                blockchainNetwork:
                    blockchainResult.blockchainNetwork,

                status:
                    'Pending'
            })
        }

        return res.status(200).json({
            message:
                'Money transferred successfully',

            transaction: {
                id:
                    transaction._id,

                transactionId:
                    transaction.transactionId,

                blockchainTransactionId:
                    transaction.blockchainTransactionId,

                blockchainHash:
                    transaction.blockchainHash,

                blockNumber:
                    transaction.blockNumber,

                blockchainNetwork:
                    transaction.blockchainNetwork,

                senderAccount:
                    transaction.senderAccount,

                receiverAccount:
                    transaction.receiverAccount,

                amount:
                    transaction.amount,

                status:
                    transaction.status,

                timestamp:
                    transaction.timestamp
            },

            senderBalance:
                blockchainResult.senderBalance,

            receiverBalance:
                blockchainResult.receiverBalance
        })

    } catch (error) {
        console.error(
            'Transfer error:',
            error
        )

        return res.status(500).json({
            message:
                'Server error while transferring money'
        })
    }
}

/*
 * Get logged-in customer details
 */
const getMyProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.userId)
            .select('-password')

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        /*
         * Get current balance from blockchain.
         */
        const balance =
            await getCustomerBalance(customer.accountNumber)

        res.status(200).json({
            customer: {
                ...customer.toObject(),
                balance
            }
        })

    } catch (error) {
        console.error(
            'Get customer profile error:',
            error
        )

        res.status(500).json({
            message: 'Server error'
        })
    }
}


/*
 * Get logged-in customer's transactions
 */
const getMyTransactions = async (req, res) => {
    try {
        const customerId = req.userId

        const transactions = await Transaction.find({
            $or: [
                { sender: customerId },
                { receiver: customerId }
            ]
        })
            .populate(
                'sender',
                'fullName accountNumber'
            )
            .populate(
                'receiver',
                'fullName accountNumber'
            )
            .sort({ createdAt: -1 })

        res.status(200).json({
            count: transactions.length,
            transactions
        })

    } catch (error) {
        console.error(
            'Get transactions error:',
            error
        )

        res.status(500).json({
            message: 'Server error'
        })
    }
}


/*
 * Verify receiver before transfer
 */
const verifyReceiver = async (req, res) => {
    try {
        const { receiverAccount } = req.query

        if (!receiverAccount) {
            return res.status(400).json({
                message:
                    'Receiver account number is required'
            })
        }

        const receiver =
            await Customer.findOne({
                accountNumber:
                    receiverAccount.trim()
            }).select(
                'fullName accountNumber accountType accountStatus'
            )

        if (!receiver) {
            return res.status(404).json({
                message:
                    'Receiver account not found'
            })
        }

        if (receiver.accountStatus !== 'Active') {
            return res.status(403).json({
                message:
                    'Receiver account is not active'
            })
        }

        res.status(200).json({
            receiver: {
                fullName: receiver.fullName,

                accountNumber:
                    receiver.accountNumber,

                accountType:
                    receiver.accountType,

                accountStatus:
                    receiver.accountStatus
            }
        })

    } catch (error) {
        console.error(
            'Verify receiver error:',
            error
        )

        res.status(500).json({
            message:
                'Server error while verifying receiver'
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Current password and new password are required'
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters'
            })
        }

        const customer = await Customer.findById(req.userId)
            .select('+password')

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        const isPasswordMatch = await bcrypt.compare(
            currentPassword,
            customer.password
        )

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            })
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            customer.password
        )

        if (isSamePassword) {
            return res.status(400).json({
                message:
                    'New password must be different from current password'
            })
        }

        customer.password = await bcrypt.hash(newPassword, 10)

        await customer.save()

        return res.status(200).json({
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error('Change password error:', error)

        return res.status(500).json({
            message: 'Server error while changing password'
        })
    }
}

module.exports = {
    transferMoney,
    getMyProfile,
    getMyTransactions,
    verifyReceiver,
    changePassword
}