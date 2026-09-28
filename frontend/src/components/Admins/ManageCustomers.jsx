import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
    LuSearch,
    LuEye,
    LuX,
    LuUserRound,
    LuMail,
    LuPhone,
    LuCreditCard,
    LuShieldCheck,
    LuWallet,
    LuMapPin,
    LuCalendarDays
} from 'react-icons/lu'
import BankContext from '../../context/BankContext'
import toast from 'react-hot-toast'

const ManageCustomers = () => {
    const { BACKEND_URL } = useContext(BankContext);
    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [statusLoading, setStatusLoading] = useState(false)

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/admin/customers`,
                {
                    withCredentials: true
                }
            )

            setCustomers(response.data.customers || [])
        } catch (error) {
            console.error('Fetch customers error:', error)

            toast.error(error.response?.data?.message ||
                'Failed to load customers')

            setError(
                error.response?.data?.message ||
                'Failed to load customers'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const filteredCustomers = useMemo(() => {
        const value = search.trim().toLowerCase()

        if (!value) {
            return customers
        }

        return customers.filter((customer) =>
            customer.fullName?.toLowerCase().includes(value) ||
            customer.email?.toLowerCase().includes(value) ||
            customer.phone?.toLowerCase().includes(value) ||
            customer.accountNumber?.toLowerCase().includes(value)
        )
    }, [customers, search])

    const totalCustomers = customers.length

    const activeCustomers = customers.filter(
        (customer) => customer.accountStatus === 'Active'
    ).length

    const frozenCustomers = customers.filter(
        (customer) => customer.accountStatus === 'Frozen'
    ).length

    const blockedCustomers = customers.filter(
        (customer) => customer.accountStatus === 'Blocked'
    ).length

    const updateStatus = async (accountNumber, accountStatus) => {
        try {
            setStatusLoading(accountNumber)
            setError('')

            const response = await axios.put(
                `${BACKEND_URL}/api/admin/customers/${accountNumber}/status`,
                { accountStatus },
                { withCredentials: true }
            )

            if (response.status === 200) {
                const updatedCustomer = response.data.customer

                setCustomers((prevCustomers) =>
                    prevCustomers.map((customer) =>
                        customer.accountNumber === accountNumber
                            ? {
                                ...customer,
                                accountStatus: updatedCustomer.accountStatus
                            }
                            : customer
                    )
                )

                if (
                    selectedCustomer &&
                    selectedCustomer.accountNumber === accountNumber
                ) {
                    setSelectedCustomer((prev) => ({
                        ...prev,
                        accountStatus: updatedCustomer.accountStatus
                    }))
                }

                toast.success(
                    `Account ${accountStatus.toLowerCase()} successfully.`
                )
            }
        } catch (error) {
            console.error('Error updating customer status:', error)

            const message =
                error.response?.data?.message ||
                'Failed to update customer account status.'

            setError(message)

            toast.error(`Failed to update account status.\n\n${message}`)
        } finally {
            setStatusLoading(null)
        }
    }

    const formatDate = (date) => {
        if (!date) return '-'

        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const formatBalance = (balance, currency = 'INR') => {
        if (balance === null || balance === undefined) {
            return 'Unavailable'
        }

        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency
        }).format(balance)
    }

    const getBalanceDisplay = (customer) => {
        if (customer.balanceError) {
            return (
                <span className="text-red-500 text-xs font-medium">
                    Balance unavailable
                </span>
            )
        }

        return formatBalance(customer.balance, customer.currency)
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'

            case 'Inactive':
                return 'bg-slate-100 text-slate-600 border-slate-200'

            case 'Frozen':
                return 'bg-amber-50 text-amber-700 border-amber-200'

            case 'Blocked':
                return 'bg-red-50 text-red-700 border-red-200'

            default:
                return 'bg-slate-100 text-slate-600 border-slate-200'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 p-4 sm:p-6 lg:p-8 lg:ml-[20vw]">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    Manage Customers
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    View and manage customer accounts
                </p>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Customers
                    </p>

                    <h2 className="text-lg lg:text-xl font-bold text-slate-800 mt-2">
                        {totalCustomers}
                    </h2>
                </div>


                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Active
                    </p>

                    <h2 className="text-lg lg:text-xl font-bold text-emerald-600 mt-2">
                        {activeCustomers}
                    </h2>
                </div>


                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Frozen
                    </p>

                    <h2 className="text-lg lg:text-xl font-bold text-amber-600 mt-2">
                        {frozenCustomers}
                    </h2>
                </div>


                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Blocked
                    </p>

                    <h2 className="text-lg lg:text-xl font-bold text-red-600 mt-2">
                        {blockedCustomers}
                    </h2>
                </div>

            </div>


            {/* Main Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Search */}
                <div className="p-5 border-b border-slate-200">

                    <div className="relative max-w-xl">

                        <LuSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={19}
                        />

                        <input
                            type="text"
                            placeholder="Search by name, email, phone or account number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />

                    </div>

                </div>


                {/* Error */}
                {error && (
                    <div className="mx-5 mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading ? (
                    <div className="p-10 text-center text-slate-500">
                        Loading customers...
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="p-10 text-center">

                        <LuUserRound
                            size={42}
                            className="mx-auto text-slate-300 mb-3"
                        />

                        <p className="text-slate-500">
                            No customers found
                        </p>

                    </div>
                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[900px]">

                            <thead className="bg-slate-50">

                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                                    <th className="px-5 py-4">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4">
                                        Account
                                    </th>

                                    <th className="px-5 py-4">
                                        Balance
                                    </th>

                                    <th className="px-5 py-4">
                                        KYC
                                    </th>

                                    <th className="px-5 py-4">
                                        Status
                                    </th>

                                    <th className="px-5 py-4">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                                {filteredCustomers.map((customer) => (

                                    <tr
                                        key={customer._id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                                                    {customer.fullName
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-slate-800">
                                                        {customer.fullName}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {customer.email}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>


                                        <td className="px-5 py-4">

                                            <p className="font-medium text-slate-700">
                                                {customer.accountNumber}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {customer.accountType}
                                            </p>

                                        </td>


                                        <td className="px-5 py-4">

                                            <p className="font-semibold text-slate-800">
                                                {getBalanceDisplay(customer)}
                                            </p>

                                        </td>


                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${customer.kyc?.status === 'Verified'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : customer.kyc?.status === 'Rejected'
                                                        ? 'bg-red-50 text-red-700 border-red-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                            >
                                                {customer.kyc?.status || 'Pending'}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                                                    customer.accountStatus
                                                )}`}
                                            >
                                                {customer.accountStatus}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4">

                                            <button
                                                onClick={() =>
                                                    setSelectedCustomer(customer)
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium"
                                            >
                                                <LuEye size={16} />
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* Customer Modal */}
            {selectedCustomer && (

                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-800">
                                    Customer Details
                                </h2>

                                <p className="text-sm text-slate-500">
                                    {selectedCustomer.accountNumber}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                            >
                                <LuX size={21} />
                            </button>

                        </div>


                        <div className="p-6 space-y-6">

                            {/* Profile */}
                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-2xl font-bold">
                                    {selectedCustomer.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="text-lg lg:text-xl font-bold text-slate-800">
                                        {selectedCustomer.fullName}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {selectedCustomer.email}
                                    </p>

                                    <span
                                        className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                                            selectedCustomer.accountStatus
                                        )}`}
                                    >
                                        {selectedCustomer.accountStatus}
                                    </span>
                                </div>

                            </div>


                            {/* Personal Information */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <InfoItem
                                        icon={<LuUserRound size={17} />}
                                        label="Full Name"
                                        value={selectedCustomer.fullName}
                                    />

                                    <InfoItem
                                        icon={<LuMail size={17} />}
                                        label="Email"
                                        value={selectedCustomer.email}
                                    />

                                    <InfoItem
                                        icon={<LuPhone size={17} />}
                                        label="Phone"
                                        value={selectedCustomer.phone}
                                    />

                                    <InfoItem
                                        icon={<LuCalendarDays size={17} />}
                                        label="Date of Birth"
                                        value={formatDate(
                                            selectedCustomer.dateOfBirth
                                        )}
                                    />

                                </div>

                            </div>


                            {/* Account Information */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    Account Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <InfoItem
                                        icon={<LuCreditCard size={17} />}
                                        label="Account Number"
                                        value={selectedCustomer.accountNumber}
                                    />

                                    <InfoItem
                                        icon={<LuCreditCard size={17} />}
                                        label="Account Type"
                                        value={selectedCustomer.accountType}
                                    />

                                    <InfoItem
                                        icon={<LuWallet size={17} />}
                                        label="Balance"
                                        value={getBalanceDisplay(selectedCustomer)}
                                    />

                                    <InfoItem
                                        icon={<LuShieldCheck size={17} />}
                                        label="KYC Status"
                                        value={selectedCustomer.kyc?.status || 'Pending'}
                                    />

                                </div>

                            </div>


                            {/* Address */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    Address
                                </h3>

                                <div className="bg-slate-50 rounded-xl p-4 flex gap-3">

                                    <LuMapPin
                                        className="text-blue-600 mt-0.5"
                                        size={18}
                                    />

                                    <div className="text-sm text-slate-600">

                                        <p>
                                            {selectedCustomer.address?.street}
                                        </p>

                                        <p>
                                            {selectedCustomer.address?.city},{' '}
                                            {selectedCustomer.address?.state}
                                        </p>

                                        <p>
                                            {selectedCustomer.address?.pincode},{' '}
                                            {selectedCustomer.address?.country}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* KYC */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    KYC Information
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <InfoItem
                                        icon={<LuShieldCheck size={17} />}
                                        label="Document Type"
                                        value={
                                            selectedCustomer.kyc?.documentType ||
                                            '-'
                                        }
                                    />

                                    <InfoItem
                                        icon={<LuShieldCheck size={17} />}
                                        label="Document Number"
                                        value={
                                            selectedCustomer.kyc?.documentNumber ||
                                            '-'
                                        }
                                    />

                                </div>

                            </div>


                            {/* Wallet */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    Blockchain Wallet
                                </h3>

                                <div className="bg-slate-50 rounded-xl p-4">

                                    <p className="text-xs text-slate-500 mb-1">
                                        Wallet Address
                                    </p>

                                    <p className="text-sm font-mono break-all text-slate-700">
                                        {selectedCustomer.walletAddress || 'Not connected'}
                                    </p>

                                </div>

                            </div>


                            {/* Actions */}
                            <div>

                                <h3 className="font-semibold text-slate-800 mb-3">
                                    Account Actions
                                </h3>

                                <div className="flex flex-wrap gap-3">

                                    <button
                                        disabled={statusLoading}
                                        onClick={() =>
                                            updateStatus(
                                                selectedCustomer.accountNumber,
                                                'Active'
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Activate
                                    </button>


                                    <button
                                        disabled={statusLoading}
                                        onClick={() =>
                                            updateStatus(
                                                selectedCustomer.accountNumber,
                                                'Inactive'
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-slate-600 text-white hover:bg-slate-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Deactivate
                                    </button>


                                    <button
                                        disabled={statusLoading}
                                        onClick={() =>
                                            updateStatus(
                                                selectedCustomer.accountNumber,
                                                'Frozen'
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Freeze
                                    </button>


                                    <button
                                        disabled={statusLoading}
                                        onClick={() =>
                                            updateStatus(
                                                selectedCustomer.accountNumber,
                                                'Blocked'
                                            )
                                        }
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
                                    >
                                        Block
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}


const InfoItem = ({ icon, label, value }) => {
    return (
        <div className="bg-slate-50 rounded-xl p-4">

            <div className="flex items-center gap-2 text-slate-500 mb-1">
                {icon}

                <span className="text-xs">
                    {label}
                </span>
            </div>

            <p className="text-sm font-medium text-slate-800 break-words">
                {value || '-'}
            </p>

        </div>
    )
}


export default ManageCustomers