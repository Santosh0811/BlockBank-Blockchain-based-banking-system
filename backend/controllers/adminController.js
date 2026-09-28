const bcrypt = require('bcryptjs')
const Cashier = require('../models/Cashier')
const Customer = require('../models/Customer')
const Transaction = require('../models/Transaction')
const Admin = require('../models/admin')

const {
    accountExists,
    getCustomerBalance,
    setAccountStatus,
    getTransaction
} = require('../services/blockchainService')

const transporter = require('../config/mailer')

const generateEmployeeId = async () => {
    const lastCashier = await Cashier.findOne({
        employeeId: /^CSH\d+$/
    }).sort({ employeeId: -1 });

    if (!lastCashier) {
        return 'CSH001';
    }

    const lastNumber = parseInt(
        lastCashier.employeeId.replace('CSH', ''),
        10
    );

    const nextNumber = lastNumber + 1;

    return `CSH${String(nextNumber).padStart(3, '0')}`;
};

const createCashier = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            branch
        } = req.body;

        // --------------------------------
        // Validate required fields
        // --------------------------------
        if (
            !fullName ||
            !email ||
            !phone ||
            !branch
        ) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        // --------------------------------
        // Check existing cashier
        // --------------------------------
        const existingCashier = await Cashier.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingCashier) {
            return res.status(400).json({
                message: 'Cashier already exists'
            });
        }

        // --------------------------------
        // Generate Employee ID
        // --------------------------------
        const employeeId = await generateEmployeeId();

        // --------------------------------
        // Generate temporary password
        // Example: CSH001@123
        // --------------------------------
        const temporaryPassword = `${employeeId}@123`;

        // --------------------------------
        // Hash password before saving
        // --------------------------------
        const hashedPassword = await bcrypt.hash(
            temporaryPassword,
            10
        );

        // --------------------------------
        // Create cashier
        // --------------------------------
        const cashier = await Cashier.create({
            fullName,
            email,
            phone,
            employeeId,
            branch,
            password: hashedPassword,
            role: 'cashier',
            status: 'Active'
        });

        // --------------------------------
        // Send welcome email
        // --------------------------------
        try {
            await transporter.sendMail({
                from: `"BlockBank" <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Welcome to BlockBank - Cashier Account Created',
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

                                            <table
                                                role="presentation"
                                                width="100%"
                                                cellspacing="0"
                                                cellpadding="0"
                                                border="0"
                                            >
                                                <tr>
                                                    <td>
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
                                                            Banking Administration System
                                                        </div>
                                                    </td>

                                                    <td align="right">
                                                        <span style="
                                                            display: inline-block;
                                                            padding: 5px 9px;
                                                            background-color: #eff6ff;
                                                            color: #1d4ed8;
                                                            font-size: 11px;
                                                            font-weight: 600;
                                                            border-radius: 4px;
                                                        ">
                                                            ACCOUNT
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                    <!-- Main Content -->
                                    <tr>
                                        <td style="padding: 32px;">

                                            <p style="
                                                margin: 0 0 6px 0;
                                                font-size: 14px;
                                                color: #6b7280;
                                            ">
                                                Hello ${fullName},
                                            </p>

                                            <h1 style="
                                                margin: 0 0 16px 0;
                                                font-size: 24px;
                                                line-height: 32px;
                                                font-weight: 600;
                                                color: #111827;
                                            ">
                                                Your cashier account is ready
                                            </h1>

                                            <p style="
                                                margin: 0;
                                                font-size: 14px;
                                                line-height: 23px;
                                                color: #4b5563;
                                            ">
                                                Your BlockBank cashier account has been
                                                created successfully. You can use the
                                                credentials below to sign in to the
                                                BlockBank cashier system.
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
                                                        padding: 18px 20px;
                                                        border-bottom: 1px solid #e5e7eb;
                                                    ">

                                                        <div style="
                                                            font-size: 11px;
                                                            font-weight: 600;
                                                            color: #6b7280;
                                                            text-transform: uppercase;
                                                            letter-spacing: 0.4px;
                                                        ">
                                                            Employee ID
                                                        </div>

                                                        <div style="
                                                            margin-top: 6px;
                                                            font-size: 17px;
                                                            font-weight: 600;
                                                            color: #111827;
                                                        ">
                                                            ${employeeId}
                                                        </div>

                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td style="padding: 18px 20px;">

                                                        <div style="
                                                            font-size: 11px;
                                                            font-weight: 600;
                                                            color: #6b7280;
                                                            text-transform: uppercase;
                                                            letter-spacing: 0.4px;
                                                        ">
                                                            Temporary Password
                                                        </div>

                                                        <div style="
                                                            margin-top: 6px;
                                                            font-size: 17px;
                                                            font-weight: 600;
                                                            color: #111827;
                                                            font-family: Arial, Helvetica, sans-serif;
                                                            word-break: break-word;
                                                        ">
                                                            ${temporaryPassword}
                                                        </div>

                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Security Notice -->
                                            <table
                                                role="presentation"
                                                width="100%"
                                                cellspacing="0"
                                                cellpadding="0"
                                                border="0"
                                                style="margin-top: 22px;"
                                            >
                                                <tr>
                                                    <td style="
                                                        padding: 14px 16px;
                                                        background-color: #f8fafc;
                                                        border-left: 3px solid #2563eb;
                                                    ">

                                                        <p style="
                                                            margin: 0;
                                                            font-size: 13px;
                                                            line-height: 20px;
                                                            color: #475569;
                                                        ">
                                                            <strong style="color: #1f2937;">
                                                                Security reminder:
                                                            </strong>
                                                            This is a temporary password.
                                                            Please change it after your first
                                                            successful login and keep your
                                                            credentials confidential.
                                                        </p>

                                                    </td>
                                                </tr>
                                            </table>

                                            <!-- Login Button -->
                                            <table
                                                role="presentation"
                                                cellspacing="0"
                                                cellpadding="0"
                                                border="0"
                                                style="margin-top: 28px;"
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
                                                font-size: 13px;
                                                line-height: 20px;
                                                color: #6b7280;
                                            ">
                                                If you were not expecting this account,
                                                please contact your BlockBank administrator.
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
            });

        } catch (emailError) {
            console.error(
                'Cashier created but email failed:',
                emailError
            );

            // Cashier was successfully created.
            // Do not delete the cashier just because email failed.
        }

        // --------------------------------
        // Response
        // --------------------------------
        return res.status(200).json({
            message: 'Cashier created successfully'
        });

    } catch (error) {
        console.error(
            'Create cashier error:',
            error
        );

        return res.status(500).json({
            message: 'Server error'
        });
    }
};

// ==========================================
// Get All Cashiers
// ==========================================

const getCashiers = async (req, res) => {
    try {
        const cashiers = await Cashier.find()
            .select(
                'fullName email phone employeeId branch role status createdAt lastLogin'
            )
            .sort({ createdAt: -1 })

        res.status(200).json({
            cashiers
        })

    } catch (error) {
        console.error(
            'Get cashiers error:',
            error
        )

        res.status(500).json({
            message: 'Failed to fetch cashiers'
        })
    }
}


// ==========================================
// Update Cashier Status
// ==========================================

const updateCashierStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const allowedStatuses = [
            'Active',
            'Inactive',
            'Suspended'
        ]

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: 'Invalid cashier status'
            })
        }

        const cashier = await Cashier.findById(id)

        if (!cashier) {
            return res.status(404).json({
                message: 'Cashier not found'
            })
        }

        cashier.status = status

        await cashier.save()

        res.status(200).json({
            message: `Cashier status ${cashier.status} successfully`
        })

    } catch (error) {
        console.error(
            'Update cashier status error:',
            error
        )

        res.status(500).json({
            message: 'Failed to update cashier status'
        })
    }
}

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .select(
                'fullName email phone dateOfBirth address accountNumber accountType currency kyc walletAddress accountStatus isEmailVerified lastLogin createdAt updatedAt'
            )
            .sort({ createdAt: -1 })

        const customersWithBalance = await Promise.all(
            customers.map(async (customer) => {
                const customerData = customer.toObject()

                try {
                    const exists = await accountExists(
                        customer.accountNumber
                    )

                    if (!exists) {
                        return {
                            ...customerData,
                            balance: null,
                            balanceError: true,
                            balanceErrorMessage:
                                'Blockchain account does not exist'
                        }
                    }

                    const balance =
                        await getCustomerBalance(
                            customer.accountNumber
                        )

                    return {
                        ...customerData,
                        balance,
                        balanceError: false
                    }
                } catch (blockchainError) {
                    console.error(
                        `Failed to get balance for ${customer.accountNumber}:`,
                        blockchainError
                    )

                    return {
                        ...customerData,
                        balance: null,
                        balanceError: true,
                        balanceErrorMessage:
                            'Unable to fetch blockchain balance'
                    }
                }
            })
        )

        return res.status(200).json({
            customers: customersWithBalance
        })
    } catch (error) {
        console.error(
            'Get admin customers error:',
            error
        )

        return res.status(500).json({
            message: 'Failed to fetch customers'
        })
    }
}

// Update customer account status
const updateCustomerStatus = async (req, res) => {
    try {
        const { accountNumber } = req.params
        const { accountStatus } = req.body

        const allowedStatuses = [
            'Active',
            'Inactive',
            'Frozen',
            'Blocked'
        ]

        if (!allowedStatuses.includes(accountStatus)) {
            return res.status(400).json({
                message: 'Invalid customer status'
            })
        }

        const customer =
            await Customer.findOne({
                accountNumber: accountNumber.trim()
            })

        if (!customer) {
            return res.status(404).json({
                message: 'Customer not found'
            })
        }

        // Make sure blockchain account exists
        const exists = await accountExists(
            customer.accountNumber
        )

        if (!exists) {
            return res.status(400).json({
                message:
                    'Customer blockchain account does not exist'
            })
        }

        /*
         * Smart contract supports only:
         *
         * Active = true
         * Inactive/Frozen/Blocked = false
         */
        const blockchainActive =
            accountStatus === 'Active'

        let blockchainResult

        // Update blockchain first
        try {
            blockchainResult =
                await setAccountStatus(
                    customer.accountNumber,
                    blockchainActive
                )
        } catch (blockchainError) {
            console.error(
                'Admin blockchain status update failed:',
                blockchainError
            )

            return res.status(500).json({
                message:
                    'Customer account status could not be updated on blockchain',
                error: blockchainError.message
            })
        }

        // Update MongoDB after blockchain succeeds
        try {
            customer.accountStatus = accountStatus

            await customer.save()
        } catch (mongoError) {
            console.error(
                'MongoDB status update failed after blockchain update:',
                mongoError
            )

            return res.status(500).json({
                message:
                    'Blockchain status was updated, but MongoDB update failed. Reconciliation is required.',
                reconciliationRequired: true,
                accountNumber: customer.accountNumber,
                blockchain: blockchainResult,
                error: mongoError.message
            })
        }

        return res.status(200).json({
            message:
                'Customer account status updated successfully',

            customer: {
                id: customer._id,
                fullName: customer.fullName,
                accountNumber: customer.accountNumber,
                accountStatus: customer.accountStatus
            },

            blockchain: blockchainResult
        })
    } catch (error) {
        console.error(
            'Update customer status error:',
            error
        )

        return res.status(500).json({
            message:
                'Failed to update customer status',
            error: error.message
        })
    }
}

const getAdminDashboard = async (req, res) => {
    try {

        // =========================
        // CASHIER STATISTICS
        // =========================

        const totalCashiers =
            await Cashier.countDocuments()

        const activeCashiers =
            await Cashier.countDocuments({
                status: 'Active'
            })


        // =========================
        // CUSTOMER STATISTICS
        // =========================

        const totalCustomers =
            await Customer.countDocuments()

        const activeCustomers =
            await Customer.countDocuments({
                accountStatus: 'Active'
            })


        // =========================
        // TRANSACTION STATISTICS
        // =========================

        const totalTransactions =
            await Transaction.countDocuments()

        const completedTransactions =
            await Transaction.countDocuments({
                status: 'Completed'
            })


        // =========================
        // TOTAL DEPOSITS
        // =========================

        const depositResult =
            await Transaction.aggregate([
                {
                    $match: {
                        type: 'Deposit',
                        status: 'Completed'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount'
                        }
                    }
                }
            ])


        const totalDeposits =
            depositResult.length > 0
                ? depositResult[0].total
                : 0


        // =========================
        // TOTAL WITHDRAWALS
        // =========================

        const withdrawalResult =
            await Transaction.aggregate([
                {
                    $match: {
                        type: 'Withdrawal',
                        status: 'Completed'
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$amount'
                        }
                    }
                }
            ])


        const totalWithdrawals =
            withdrawalResult.length > 0
                ? withdrawalResult[0].total
                : 0


        // =========================
        // RECENT TRANSACTIONS
        // =========================

        const recentTransactions =
            await Transaction.find()
                .populate(
                    'sender',
                    'fullName accountNumber'
                )
                .populate(
                    'receiver',
                    'fullName accountNumber'
                )
                .populate(
                    'processedBy',
                    'fullName employeeId'
                )
                .sort({
                    timestamp: -1
                })
                .limit(5)


        // =========================
        // RESPONSE
        // =========================

        res.status(200).json({

            stats: {

                totalCashiers,

                activeCashiers,

                totalCustomers,

                activeCustomers,

                totalTransactions,

                completedTransactions,

                totalDeposits,

                totalWithdrawals

            },

            recentTransactions

        })

    } catch (error) {

        console.error(
            'Get admin dashboard error:',
            error
        )

        res.status(500).json({
            message:
                'Failed to load admin dashboard'
        })
    }
}

const getAdminTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('sender', 'fullName accountNumber email')
            .populate('receiver', 'fullName accountNumber email')
            .populate('processedBy', 'fullName employeeId branch')
            .sort({ timestamp: -1 })

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        })
    } catch (error) {
        console.error('Get admin transactions error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions'
        })
    }
}

const getBlockchainTransaction = async (req, res) => {
    try {
        const { transactionId } = req.params

        const transaction = await Transaction.findById(transactionId)

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            })
        }

        if (!transaction.blockchainTransactionId) {
            return res.status(404).json({
                success: false,
                message: 'Blockchain transaction ID is not available'
            })
        }

        const blockchainTransaction = await getTransaction(
            transaction.blockchainTransactionId,
            transaction.blockchainHash
        )

        // Fallback to MongoDB block number if available
        if (
            blockchainTransaction.blockNumber === null &&
            transaction.blockNumber
        ) {
            blockchainTransaction.blockNumber = transaction.blockNumber
        }

        return res.status(200).json({
            success: true,
            transaction: blockchainTransaction
        })

    } catch (error) {
        console.error('Get blockchain transaction error:', error)

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction from blockchain',
            error: error.message
        })
    }
}

const changeAdminPassword = async (req, res) => {
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
        if (req.role !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can change their password'
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

        // Find logged-in admin
        const admin = await Admin.findById(req.userId).select('+password')

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            })
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            admin.password
        )

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            })
        }

        // Make sure new password is different
        const isSamePassword = await bcrypt.compare(
            newPassword,
            admin.password
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
        admin.password = hashedPassword

        await admin.save()

        return res.status(200).json({
            message: 'Password changed successfully'
        })

    } catch (error) {
        console.error(
            'Change admin password error:',
            error
        )

        return res.status(500).json({
            message: 'Server error'
        })
    }
}

module.exports = {
    createCashier,
    getCashiers,
    updateCashierStatus,
    getCustomers,
    updateCustomerStatus,
    getAdminDashboard,
    getAdminTransactions,
    getBlockchainTransaction,
    changeAdminPassword
}