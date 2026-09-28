const express = require('express');
const router = express.Router();

const authUser = require('../middleware/authUser');
const allowRoles = require('../middleware/allowRoles');

const {
    createCashier,
    getCashiers,
    updateCashierStatus,
    getCustomers,
    updateCustomerStatus,
    getAdminDashboard,
    getAdminTransactions,
    getBlockchainTransaction,
    changeAdminPassword
} = require('../controllers/adminController');

router.post(
    '/cashiers',
    authUser,
    allowRoles('admin'),
    createCashier
);

router.get(
    '/cashiers',
    authUser,
    allowRoles('admin'),
    getCashiers
);

router.put(
    '/cashiers/:id/status',
    authUser,
    allowRoles('admin'),
    updateCashierStatus
)

router.get(
    '/customers',
    authUser,
    allowRoles('admin'),
    getCustomers)

router.put(
    '/customers/:accountNumber/status',
    authUser,
    allowRoles('admin'),
    updateCustomerStatus
)

router.get(
    '/dashboard',
    authUser,
    allowRoles('admin'),
    getAdminDashboard
)

router.get(
    '/transactions',
    authUser,
    allowRoles('admin'),
    getAdminTransactions
)

router.get(
    '/transactions/:transactionId/blockchain',
    authUser,
    allowRoles('admin'),
    getBlockchainTransaction
)

router.put(
    '/change-password',
    authUser,
    allowRoles('admin'),
    changeAdminPassword
)

module.exports = router;