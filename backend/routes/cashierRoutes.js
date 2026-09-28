const express = require('express')
const router = express.Router()

const authUser = require('../middleware/authUser')
const allowRoles = require('../middleware/allowRoles')

const {
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
} = require('../controllers/cashierController')

router.get(
    '/dashboard',
    authUser,
    allowRoles('cashier'),
    getCashierDashboard
)

router.post(
    '/customers',
    authUser,
    allowRoles('cashier'),
    createCustomer
)

router.get(
    '/verify-customer',
    authUser,
    allowRoles('cashier'),
    verifyCustomer
)

router.post(
    '/deposit',
    authUser,
    allowRoles('cashier'),
    depositMoney
)

router.post(
    '/withdrawal',
    authUser,
    allowRoles('cashier'),
    withdrawMoney
)

router.get(
    '/customers',
    authUser,
    allowRoles('cashier'),
    getCustomers
)

router.get(
    '/customer/:accountNumber',
    authUser,
    allowRoles('cashier'),
    getCustomerByAccount
)

router.put(
    '/customer/:accountNumber',
    authUser,
    allowRoles('cashier'),
    updateCustomer
)

router.get(
    '/transactions',
    authUser,
    allowRoles('cashier'),
    getCashierTransactions
)

router.put(
    '/change-password',
    authUser,
    allowRoles('cashier'),
    changeCashierPassword
)

module.exports = router