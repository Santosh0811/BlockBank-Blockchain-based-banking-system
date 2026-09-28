const bcrypt = require('bcryptjs')
const Customer = require('../models/Customer')
const Transaction = require('../models/Transaction')
const Cashier = require('../models/Cashier')
const {
    createCustomerAccount,
    accountExists,
    deposit: blockchainDeposit,
    getCustomerBalance,
    withdraw: blockchainWithdraw,
    setAccountStatus
} = require('../services/blockchainService')

const transporter = require('../config/mailer')

const createCustomer = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            dateOfBirth,
            address,
            accountType = 'Savings',
            currency = 'INR',

            // KYC fields
            documentType,
            documentNumber
        } = req.body

        // ---------------------------------------------
        // Validate required fields
        // ---------------------------------------------

        if (
            !fullName ||
            !email ||
            !phone ||
            !dateOfBirth ||
            !address
        ) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            })
        }

        // ---------------------------------------------
        // Check duplicate email
        // ---------------------------------------------

        const existingEmail = await Customer.findOne({
            email
        })

        if (existingEmail) {
            return res.status(400).json({
                message: 'Customer with this email already exists'
            })
        }

        // ---------------------------------------------
        // Check duplicate phone
        // ---------------------------------------------

        const existingPhone = await Customer.findOne({
            phone
        })

        if (existingPhone) {
            return res.status(400).json({
                message: 'Customer with this phone number already exists'
            })
        }

        const firstName = fullName
            .trim()
            .split(/\s+/)[0]
            .replace(/[^a-zA-Z]/g, '')

        const dob = new Date(dateOfBirth)

        if (isNaN(dob.getTime())) {
            return res.status(400).json({
                message: 'Invalid date of birth'
            })
        }

        const dobYear = dob.getFullYear()

        const generatedPassword =
            `${firstName}@${dobYear}`

        // ---------------------------------------------
        // Hash password
        // ---------------------------------------------

        const hashedPassword = await bcrypt.hash(
            generatedPassword,
            10
        )

        // ---------------------------------------------
        // Generate account number
        // ---------------------------------------------

        const accountNumber =
            'BB' + Date.now().toString().slice(-10)

        // ---------------------------------------------
        // KYC STATUS
        //
        // Document number exists:
        //     Verified
        //
        // Document number does not exist:
        //     Pending
        // ---------------------------------------------

        const hasDocumentNumber =
            typeof documentNumber === 'string' &&
            documentNumber.trim() !== ''

        const kycData = {
            status: hasDocumentNumber
                ? 'Verified'
                : 'Pending',

            documentType:
                documentType || undefined,

            documentNumber:
                hasDocumentNumber
                    ? documentNumber.trim()
                    : undefined,

            verifiedAt:
                hasDocumentNumber
                    ? new Date()
                    : undefined
        }

        // ---------------------------------------------
        // Create MongoDB customer
        // ---------------------------------------------

        const customer = await Customer.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            dateOfBirth,
            address,
            accountNumber,
            accountType,
            currency,
            accountStatus: 'Active',
            kyc: kycData
        })

        try {
            // ---------------------------------------------
            // Create blockchain account
            // ---------------------------------------------

            const blockchainResult =
                await createCustomerAccount(accountNumber)

            // ---------------------------------------------
            // Send welcome email
            // ---------------------------------------------

            try {
                await transporter.sendMail({
                    from: `"BlockBank" <${process.env.SMTP_USER}>`,
                    to: email,
                    subject: 'Welcome to BlockBank - Account Created',
                    html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>BlockBank Account Created</title>
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background-color: #f5f7fa;
                        font-family: Arial, Helvetica, sans-serif;
                        color: #1f2937;
                    ">

                        <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            style="background-color: #f5f7fa;"
                        >
                            <tr>
                                <td align="center" style="padding: 32px 16px;">

                                    <table
                                        role="presentation"
                                        width="100%"
                                        cellspacing="0"
                                        cellpadding="0"
                                        border="0"
                                        style="
                                            max-width: 560px;
                                            background-color: #ffffff;
                                            border: 1px solid #e5e7eb;
                                        "
                                    >

                                        <!-- Header -->
                                        <tr>
                                            <td style="
                                                padding: 24px 32px;
                                                border-bottom: 1px solid #e5e7eb;
                                            ">

                                                <div style="
                                                    font-size: 22px;
                                                    line-height: 28px;
                                                    font-weight: 700;
                                                    color: #111827;
                                                ">
                                                    BlockBank
                                                </div>

                                                <div style="
                                                    margin-top: 3px;
                                                    font-size: 12px;
                                                    color: #6b7280;
                                                ">
                                                    Secure Banking System
                                                </div>

                                            </td>
                                        </tr>

                                        <!-- Content -->
                                        <tr>
                                            <td style="padding: 32px;">

                                                <p style="
                                                    margin: 0 0 6px 0;
                                                    font-size: 14px;
                                                    color: #6b7280;
                                                ">
                                                    Dear ${fullName},
                                                </p>

                                                <h1 style="
                                                    margin: 0 0 16px 0;
                                                    font-size: 24px;
                                                    line-height: 32px;
                                                    font-weight: 600;
                                                    color: #111827;
                                                ">
                                                    Your account has been created
                                                </h1>

                                                <p style="
                                                    margin: 0;
                                                    font-size: 14px;
                                                    line-height: 23px;
                                                    color: #4b5563;
                                                ">
                                                    Your BlockBank account has been created
                                                    successfully. Your account details are
                                                    provided below.
                                                </p>

                                                <!-- Account Details -->
                                                <table
                                                    role="presentation"
                                                    width="100%"
                                                    cellspacing="0"
                                                    cellpadding="0"
                                                    border="0"
                                                    style="
                                                        margin-top: 24px;
                                                        border: 1px solid #e5e7eb;
                                                    "
                                                >

                                                    <tr>
                                                        <td style="
                                                            padding: 16px 20px;
                                                            border-bottom: 1px solid #e5e7eb;
                                                        ">
                                                            <div style="
                                                                font-size: 11px;
                                                                font-weight: 600;
                                                                color: #6b7280;
                                                                text-transform: uppercase;
                                                                letter-spacing: 0.4px;
                                                            ">
                                                                Account Number
                                                            </div>

                                                            <div style="
                                                                margin-top: 6px;
                                                                font-size: 17px;
                                                                font-weight: 600;
                                                                color: #111827;
                                                            ">
                                                                ${accountNumber}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="
                                                            padding: 16px 20px;
                                                            border-bottom: 1px solid #e5e7eb;
                                                        ">
                                                            <div style="
                                                                font-size: 11px;
                                                                font-weight: 600;
                                                                color: #6b7280;
                                                                text-transform: uppercase;
                                                                letter-spacing: 0.4px;
                                                            ">
                                                                Email Address
                                                            </div>

                                                            <div style="
                                                                margin-top: 6px;
                                                                font-size: 15px;
                                                                color: #111827;
                                                                word-break: break-word;
                                                            ">
                                                                ${email}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="
                                                            padding: 16px 20px;
                                                            border-bottom: 1px solid #e5e7eb;
                                                        ">
                                                            <div style="
                                                                font-size: 11px;
                                                                font-weight: 600;
                                                                color: #6b7280;
                                                                text-transform: uppercase;
                                                                letter-spacing: 0.4px;
                                                            ">
                                                                Account Type
                                                            </div>

                                                            <div style="
                                                                margin-top: 6px;
                                                                font-size: 15px;
                                                                color: #111827;
                                                            ">
                                                                ${accountType}
                                                            </div>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td style="padding: 16px 20px;">
                                                            <div style="
                                                                font-size: 11px;
                                                                font-weight: 600;
                                                                color: #6b7280;
                                                                text-transform: uppercase;
                                                                letter-spacing: 0.4px;
                                                            ">
                                                                KYC Status
                                                            </div>

                                                            <div style="
                                                                margin-top: 6px;
                                                                font-size: 15px;
                                                                font-weight: 600;
                                                                color: ${hasDocumentNumber
                            ? '#166534'
                            : '#92400e'
                        };
                                                            ">
                                                                ${hasDocumentNumber
                            ? 'Verified'
                            : 'Pending'
                        }
                                                            </div>
                                                        </td>
                                                    </tr>

                                                </table>

                                                <!-- Login Credentials -->
                                                <div style="
                                                    margin-top: 24px;
                                                    padding: 16px 20px;
                                                    background-color: #f8fafc;
                                                    border-left: 3px solid #2563eb;
                                                ">

                                                    <p style="
                                                        margin: 0 0 8px 0;
                                                        font-size: 13px;
                                                        font-weight: 600;
                                                        color: #1f2937;
                                                    ">
                                                        Login information
                                                    </p>

                                                    <p style="
                                                        margin: 0 0 5px 0;
                                                        font-size: 13px;
                                                        color: #4b5563;
                                                    ">
                                                        <strong>Email:</strong> ${email}
                                                    </p>

                                                    <p style="
                                                        margin: 0;
                                                        font-size: 13px;
                                                        color: #4b5563;
                                                    ">
                                                        <strong>Initial Password:</strong>
                                                        ${generatedPassword}
                                                    </p>

                                                </div>

                                                <!-- Security Notice -->
                                                <p style="
                                                    margin: 22px 0 0 0;
                                                    font-size: 13px;
                                                    line-height: 20px;
                                                    color: #6b7280;
                                                ">
                                                    For your security, please change your initial
                                                    password after signing in and do not share
                                                    your login credentials with anyone.
                                                </p>

                                                <!-- Login Button -->
                                                <table
                                                    role="presentation"
                                                    cellspacing="0"
                                                    cellpadding="0"
                                                    border="0"
                                                    style="margin-top: 26px;"
                                                >
                                                    <tr>
                                                        <td>
                                                            <a
                                                                href="${process.env.FRONTEND_URL}/login"
                                                                style="
                                                                    display: inline-block;
                                                                    padding: 11px 20px;
                                                                    background-color: #2563eb;
                                                                    color: #ffffff;
                                                                    text-decoration: none;
                                                                    font-size: 14px;
                                                                    font-weight: 600;
                                                                    border-radius: 6px;
                                                                "
                                                            >
                                                                Sign in to BlockBank
                                                            </a>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <p style="
                                                    margin: 24px 0 0 0;
                                                    font-size: 12px;
                                                    line-height: 19px;
                                                    color: #9ca3af;
                                                ">
                                                    If you did not expect this account to be
                                                    created, please contact BlockBank support.
                                                </p>

                                            </td>
                                        </tr>

                                        <!-- Footer -->
                                        <tr>
                                            <td style="
                                                padding: 20px 32px;
                                                background-color: #f9fafb;
                                                border-top: 1px solid #e5e7eb;
                                                text-align: center;
                                            ">

                                                <p style="
                                                    margin: 0;
                                                    font-size: 11px;
                                                    line-height: 18px;
                                                    color: #9ca3af;
                                                ">
                                                    This is an automated message from BlockBank.
                                                    Please do not reply to this email.
                                                </p>

                                                <p style="
                                                    margin: 5px 0 0 0;
                                                    font-size: 11px;
                                                    color: #9ca3af;
                                                ">
                                                    © ${new Date().getFullYear()} BlockBank
                                                </p>

                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>
                        </table>

                    </body>
                    </html>
                    `
                })

            } catch (emailError) {

                // Customer and blockchain account were
                // successfully created.
                // Do not roll back because email failed.

                console.error(
                    'Customer created but welcome email failed:',
                    emailError
                )
            }

            // ---------------------------------------------
            // Success response
            // ---------------------------------------------

            return res.status(200).json({
                message: 'Customer created successfully'
            })

        } catch (blockchainError) {

            // Blockchain account creation failed.
            // Remove MongoDB customer to keep both systems consistent.

            await Customer.findByIdAndDelete(
                customer._id
            )

            console.error(
                'Blockchain account creation failed:',
                blockchainError
            )

            return res.status(500).json({
                message:
                    'Customer creation failed because blockchain account could not be created'
            })
        }

    } catch (error) {

        console.error(
            'Create customer error:',
            error
        )

        return res.status(500).json({
            message: 'Failed to create customer',
            error: error.message
        })
    }
}

const getCashierDashboard = async (req, res) => {
    try {
        const cashier = await Cashier.findById(req.userId).select(
            'fullName employeeId branch status'
        )

        if (!cashier) {
            return res.status(404).json({
                message: 'Cashier not found'
            })
        }

        // Start of today
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        // End of today
        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        // Total registered customers
        const customerCount = await Customer.countDocuments()

        // Today's deposits
        const depositResult = await Transaction.aggregate([
            {
                $match: {
                    type: 'Deposit',
                    status: 'Completed',
                    timestamp: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        // Today's withdrawals
        const withdrawalResult = await Transaction.aggregate([
            {
                $match: {
                    type: 'Withdrawal',
                    status: 'Completed',
                    timestamp: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])

        // Today's transaction count
        const transactionCount = await Transaction.countDocuments({
            status: 'Completed',
            timestamp: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })

        res.status(200).json({
            cashier: {
                fullName: cashier.fullName,
                employeeId: cashier.employeeId,
                branch: cashier.branch,
                status: cashier.status
            },

            stats: {
                customers: customerCount,
                todayDeposits: depositResult[0]?.total || 0,
                todayWithdrawals: withdrawalResult[0]?.total || 0,
                transactions: transactionCount
            }
        })

    } catch (error) {
        console.error('Cashier dashboard error:', error)

        res.status(500).json({
            message: 'Failed to load cashier dashboard'
        })
    }
}

const verifyCustomer = async (req, res) => {
    try {
        const { accountNumber } = req.query

        if (!accountNumber) {
            return res.status(400).json({
                message: 'Account number is required'
            })
        }

        const customer = await Customer.findOne({
            accountNumber: accountNumber.trim()
        }).select(
            'fullName accountNumber accountType accountStatus'
        )

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        if (customer.accountStatus !== 'Active') {
            return res.status(400).json({
                message: `Customer account is ${customer.accountStatus}`
            })
        }

        // Check that the account exists on blockchain
        const blockchainAccountExists = await accountExists(customer.accountNumber)

        if (!blockchainAccountExists) {
            return res.status(400).json({
                message:
                    'Customer blockchain account does not exist'
            })
        }

        // Read balance from blockchain
        const balance = await getCustomerBalance(
            customer.accountNumber
        )

        res.status(200).json({
            customer: {
                fullName: customer.fullName,
                accountNumber: customer.accountNumber,
                accountType: customer.accountType,
                balance,
                accountStatus: customer.accountStatus
            }
        })

    } catch (error) {
        console.error(
            'Verify customer error:',
            error
        )

        res.status(500).json({
            message: 'Failed to verify customer'
        })
    }
}

const depositMoney = async (req, res) => {
    try {
        const {
            accountNumber,
            amount,
            description
        } = req.body

        if (!accountNumber || amount === undefined) {
            return res.status(400).json({
                message:
                    'Account number and amount are required'
            })
        }

        const depositAmount = Number(amount)

        if (
            !Number.isFinite(depositAmount) ||
            depositAmount <= 0
        ) {
            return res.status(400).json({
                message: 'Invalid deposit amount'
            })
        }

        if (
            Math.round(depositAmount * 100) !==
            depositAmount * 100
        ) {
            return res.status(400).json({
                message:
                    'Amount can have maximum 2 decimal places'
            })
        }

        const customer =
            await Customer.findOne({
                accountNumber:
                    accountNumber.trim()
            })

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        if (customer.accountStatus !== 'Active') {
            return res.status(400).json({
                message:
                    `Customer account is ${customer.accountStatus}`
            })
        }

        const blockchainAccountExists =
            await accountExists(
                customer.accountNumber
            )

        if (!blockchainAccountExists) {
            return res.status(400).json({
                message:
                    'Customer blockchain account does not exist'
            })
        }

        const previousBalance =
            await getCustomerBalance(
                customer.accountNumber
            )

        const transactionId =
            'TXN' +
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )

        const transactionDescription =
            description?.trim() || 'Cash deposit'

        /*
         * Create Pending transaction BEFORE blockchain call.
         */
        const transaction =
            await Transaction.create({
                transactionId,

                sender: null,

                receiver:
                    customer._id,

                senderAccount:
                    'CASHIER',

                receiverAccount:
                    customer.accountNumber,

                amount:
                    depositAmount,

                type:
                    'Deposit',

                description:
                    transactionDescription,

                status:
                    'Pending',

                processedBy:
                    req.userId,

                timestamp:
                    new Date()
            })

        /*
         * ONLY blockchain failure belongs here.
         */
        let blockchainResult

        try {
            blockchainResult =
                await blockchainDeposit(
                    customer.accountNumber,
                    depositAmount,
                    transactionDescription
                )

        } catch (blockchainError) {
            console.error(
                'Blockchain deposit error:',
                blockchainError
            )

            try {
                transaction.status =
                    'Failed'

                await transaction.save()

            } catch (mongoError) {
                console.error(
                    'Failed to mark deposit as Failed:',
                    mongoError
                )
            }

            return res.status(400).json({
                message:
                    blockchainError.message ||
                    'Blockchain deposit failed'
            })
        }

        /*
         * Blockchain succeeded.
         *
         * Now update MongoDB separately.
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
            console.error(
                'MongoDB update failed after blockchain deposit:',
                mongoError
            )

            return res.status(500).json({
                message:
                    'Deposit completed on blockchain, but the transaction record could not be updated. Reconciliation is required.',

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
                'Deposit successful',

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

                amount:
                    transaction.amount,

                type:
                    transaction.type,

                status:
                    transaction.status,

                receiverAccount:
                    transaction.receiverAccount,

                timestamp:
                    transaction.timestamp
            },

            customer: {
                fullName:
                    customer.fullName,

                accountNumber:
                    customer.accountNumber,

                previousBalance,

                newBalance:
                    blockchainResult.newBalance
            }
        })

    } catch (error) {
        console.error(
            'Deposit error:',
            error
        )

        return res.status(500).json({
            message:
                error.message ||
                'Failed to process deposit'
        })
    }
}

const withdrawMoney = async (req, res) => {
    try {
        const {
            accountNumber,
            amount,
            description
        } = req.body

        if (!accountNumber || amount === undefined) {
            return res.status(400).json({
                message:
                    'Account number and amount are required'
            })
        }

        const withdrawalAmount =
            Number(amount)

        if (
            !Number.isFinite(withdrawalAmount) ||
            withdrawalAmount <= 0
        ) {
            return res.status(400).json({
                message:
                    'Invalid withdrawal amount'
            })
        }

        if (
            Math.round(withdrawalAmount * 100) !==
            withdrawalAmount * 100
        ) {
            return res.status(400).json({
                message:
                    'Amount can have maximum 2 decimal places'
            })
        }

        const customer =
            await Customer.findOne({
                accountNumber:
                    accountNumber.trim()
            })

        if (!customer) {
            return res.status(404).json({
                message:
                    'Customer not found'
            })
        }

        if (customer.accountStatus !== 'Active') {
            return res.status(400).json({
                message:
                    `Customer account is ${customer.accountStatus}`
            })
        }

        const blockchainAccountExists =
            await accountExists(
                customer.accountNumber
            )

        if (!blockchainAccountExists) {
            return res.status(400).json({
                message:
                    'Customer blockchain account does not exist'
            })
        }

        /*
         * Blockchain is the source of truth.
         */
        const previousBalance =
            await getCustomerBalance(
                customer.accountNumber
            )

        if (withdrawalAmount > previousBalance) {
            return res.status(400).json({
                message:
                    'Insufficient balance'
            })
        }

        const transactionId =
            'TXN' +
            Date.now() +
            Math.floor(
                Math.random() * 1000
            )

        const transactionDescription =
            description?.trim() || 'Cash withdrawal'

        /*
         * Create Pending transaction BEFORE
         * blockchain withdrawal.
         */
        const transaction =
            await Transaction.create({
                transactionId,

                sender:
                    customer._id,

                receiver:
                    null,

                senderAccount:
                    customer.accountNumber,

                receiverAccount:
                    'CASHIER',

                amount:
                    withdrawalAmount,

                type:
                    'Withdrawal',

                description:
                    transactionDescription,

                status:
                    'Pending',

                processedBy:
                    req.userId,

                timestamp:
                    new Date()
            })

        /*
         * ONLY blockchain failure belongs here.
         */
        let blockchainResult

        try {
            blockchainResult =
                await blockchainWithdraw(
                    customer.accountNumber,
                    withdrawalAmount,
                    transactionDescription
                )

        } catch (blockchainError) {
            console.error(
                'Blockchain withdrawal error:',
                blockchainError
            )

            try {
                transaction.status =
                    'Failed'

                await transaction.save()

            } catch (mongoError) {
                console.error(
                    'Failed to mark withdrawal as Failed:',
                    mongoError
                )
            }

            return res.status(400).json({
                message:
                    blockchainError.message ||
                    'Blockchain withdrawal failed'
            })
        }

        /*
         * Blockchain succeeded.
         *
         * Update MongoDB separately.
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
            console.error(
                'MongoDB update failed after blockchain withdrawal:',
                mongoError
            )

            return res.status(500).json({
                message:
                    'Withdrawal completed on blockchain, but the transaction record could not be updated. Reconciliation is required.',

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
                'Withdrawal successful',

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

                amount:
                    transaction.amount,

                type:
                    transaction.type,

                status:
                    transaction.status,

                senderAccount:
                    transaction.senderAccount,

                timestamp:
                    transaction.timestamp
            },

            customer: {
                fullName:
                    customer.fullName,

                accountNumber:
                    customer.accountNumber,

                previousBalance,

                newBalance:
                    blockchainResult.newBalance
            }
        })

    } catch (error) {
        console.error(
            'Withdrawal error:',
            error
        )

        return res.status(500).json({
            message:
                error.message ||
                'Failed to process withdrawal'
        })
    }
}

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .select(
                'fullName email phone dateOfBirth address accountNumber accountType currency kyc walletAddress accountStatus isEmailVerified lastLogin createdAt updatedAt'
            )
            .sort({ createdAt: -1 })

        /*
         * Get the current balance from blockchain
         * for every customer.
         */
        const customersWithBalance = await Promise.all(
            customers.map(async (customer) => {
                try {
                    const balance =
                        await getCustomerBalance(
                            customer.accountNumber
                        )

                    return {
                        ...customer.toObject(),
                        balance
                    }

                } catch (error) {
                    console.error(
                        `Blockchain balance error for ${customer.accountNumber}:`,
                        error.message
                    )

                    return {
                        ...customer.toObject(),
                        balance: null,
                        balanceError: true
                    }
                }
            })
        )

        res.status(200).json({
            customers: customersWithBalance
        })

    } catch (error) {
        console.error(
            'Get customers error:',
            error
        )

        res.status(500).json({
            message: 'Failed to fetch customers'
        })
    }
}

const getCustomerByAccount = async (req, res) => {
    try {
        const { accountNumber } = req.params

        const customer = await Customer.findOne({
            accountNumber
        }).select('-password')

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        // Read current balance from blockchain
        const balance = await getCustomerBalance(
            customer.accountNumber
        )

        res.status(200).json({
            customer: {
                ...customer.toObject(),
                balance
            }
        })

    } catch (error) {
        console.error(
            'Get customer error:',
            error
        )

        res.status(500).json({
            message: 'Failed to get customer'
        })
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { accountNumber } = req.params

        const {
            fullName,
            email,
            phone,
            dateOfBirth,
            address,
            accountType,

            // KYC fields
            kycStatus,
            documentType,
            documentNumber,

            // Account status
            accountStatus
        } = req.body

        const customer = await Customer.findOne({ accountNumber })

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        // Check duplicate email
        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({
                email,
                _id: { $ne: customer._id }
            })

            if (existingEmail) {
                return res.status(409).json({
                    message: 'Email already registered'
                })
            }
        }

        // Check duplicate phone
        if (phone && phone !== customer.phone) {
            const existingPhone = await Customer.findOne({
                phone,
                _id: { $ne: customer._id }
            })

            if (existingPhone) {
                return res.status(409).json({
                    message: 'Phone number already registered'
                })
            }
        }

        // =========================
        // PERSONAL INFORMATION
        // =========================

        if (fullName !== undefined) {
            customer.fullName = fullName
        }

        if (email !== undefined) {
            customer.email = email
        }

        if (phone !== undefined) {
            customer.phone = phone
        }

        if (dateOfBirth !== undefined) {
            customer.dateOfBirth = dateOfBirth
        }

        if (address !== undefined) {
            customer.address = address
        }

        if (accountType !== undefined) {
            customer.accountType = accountType
        }

        // =========================
        // KYC INFORMATION
        // =========================

        if (
            kycStatus !== undefined ||
            documentType !== undefined ||
            documentNumber !== undefined
        ) {
            const validKycStatuses = [
                'Pending',
                'Verified',
                'Rejected'
            ]

            if (
                kycStatus !== undefined &&
                !validKycStatuses.includes(kycStatus)
            ) {
                return res.status(400).json({
                    message: 'Invalid KYC status'
                })
            }

            if (kycStatus !== undefined) {
                customer.kyc.status = kycStatus
            }

            if (documentType !== undefined) {
                customer.kyc.documentType = documentType
            }

            if (documentNumber !== undefined) {
                customer.kyc.documentNumber = documentNumber
            }

            // Set verification date when KYC is verified
            if (kycStatus === 'Verified') {
                customer.kyc.verifiedAt = new Date()
            }

            // Clear verification date if KYC is rejected/pending
            if (
                kycStatus === 'Pending' ||
                kycStatus === 'Rejected'
            ) {
                customer.kyc.verifiedAt = undefined
            }

            // Tell Mongoose nested KYC object was modified
            customer.markModified('kyc')
        }

        // =========================
        // ACCOUNT STATUS
        // =========================

        let blockchainResult = null

        if (accountStatus !== undefined) {
            const validAccountStatuses = [
                'Active',
                'Inactive',
                'Frozen',
                'Blocked'
            ]

            if (!validAccountStatuses.includes(accountStatus)) {
                return res.status(400).json({
                    message: 'Invalid account status'
                })
            }

            /*
             * Blockchain only supports:
             *
             * Active = true
             * Everything else = false
             */
            const blockchainActive =
                accountStatus === 'Active'

            try {
                blockchainResult = await setAccountStatus(
                    accountNumber,
                    blockchainActive
                )
            } catch (blockchainError) {
                console.error(
                    'Blockchain account status update failed:',
                    blockchainError
                )

                return res.status(500).json({
                    message:
                        'Account status could not be updated on blockchain',
                    error: blockchainError.message
                })
            }

            // Update MongoDB account status
            customer.accountStatus = accountStatus
        }

        // =========================
        // SAVE TO MONGODB
        // =========================

        try {
            await customer.save()
        } catch (mongoError) {
            console.error(
                'MongoDB customer update failed:',
                mongoError
            )

            /*
             * If blockchain was already updated successfully,
             * do not pretend the blockchain update failed.
             */
            if (blockchainResult) {
                return res.status(500).json({
                    message:
                        'Blockchain account status was updated, but MongoDB update failed. Reconciliation is required.',
                    reconciliationRequired: true,
                    accountNumber,
                    blockchain: blockchainResult,
                    error: mongoError.message
                })
            }

            return res.status(500).json({
                message:
                    'Failed to update customer in MongoDB',
                error: mongoError.message
            })
        }

        // =========================
        // RESPONSE
        // =========================

        const customerResponse =
            customer.toObject()

        delete customerResponse.password

        return res.status(200).json({
            message: 'Customer updated successfully'
        })

    } catch (error) {
        console.error(
            'Update customer error:',
            error
        )

        return res.status(500).json({
            message: 'Failed to update customer',
            error: error.message
        })
    }
}

const getCashierTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            processedBy: { $ne: null }
        })
            .populate('sender', 'fullName accountNumber')
            .populate('receiver', 'fullName accountNumber')
            .populate('processedBy', 'fullName employeeId')
            .sort({ timestamp: -1 })

        res.status(200).json({
            transactions
        })
    } catch (error) {
        console.error('Get cashier transactions error:', error)

        res.status(500).json({
            message: 'Failed to fetch transactions'
        })
    }
}

const changeCashierPassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body

        // Check required fields
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        // Check role
        if (req.role !== 'cashier') {
            return res.status(403).json({
                message: 'Only cashiers can change their password'
            })
        }

        // Check new password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'New passwords do not match'
            })
        }

        // Minimum password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            })
        }

        // Find logged-in cashier
        const cashier = await Cashier.findById(req.userId).select('+password')

        if (!cashier) {
            return res.status(404).json({
                message: 'Cashier not found'
            })
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            cashier.password
        )

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            })
        }

        // Make sure new password is different
        const isSamePassword = await bcrypt.compare(
            newPassword,
            cashier.password
        )

        if (isSamePassword) {
            return res.status(400).json({
                message: 'New password must be different from current password'
            })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        )

        // Update password
        cashier.password = hashedPassword

        await cashier.save()

        return res.status(200).json({
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error(
            'Change cashier password error:',
            error
        )

        return res.status(500).json({
            message: 'Server error'
        })
    }
}

module.exports = {
    createCustomer,
    getCashierDashboard,
    verifyCustomer,
    depositMoney,
    withdrawMoney,
    getCustomers,
    getCustomerByAccount,
    updateCustomer,
    getCashierTransactions,
    changeCashierPassword
}