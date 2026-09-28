import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
    FiActivity,
    FiSearch,
    FiRefreshCw,
    FiEye,
    FiX,
    FiCheckCircle,
    FiClock,
    FiAlertCircle,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiHash,
    FiCalendar,
    FiDollarSign,
    FiUser
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { LuArrowLeftRight } from 'react-icons/lu'

import axios from 'axios'
import BankContext from '../../context/BankContext'

const Transactions = () => {
    const { BACKEND_URL } = useContext(BankContext);
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')

    const [selectedTransaction, setSelectedTransaction] = useState(null)

    const fetchTransactions = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/cashier/transactions`,
                {
                    withCredentials: true
                }
            )

            setTransactions(response.data.transactions || [])
        } catch (error) {
            console.error('Get transactions error:', error)

            toast.error(
                error.response?.data?.message ||
                'Failed to load transactions'
            )

            setError(
                error.response?.data?.message ||
                'Failed to load transactions'
            )
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const searchValue = search.toLowerCase().trim()

            const matchesSearch =
                !searchValue ||
                transaction.transactionId?.toLowerCase().includes(searchValue) ||
                transaction.senderAccount?.toLowerCase().includes(searchValue) ||
                transaction.receiverAccount?.toLowerCase().includes(searchValue) ||
                transaction.description?.toLowerCase().includes(searchValue)

            const matchesType =
                typeFilter === 'All' ||
                transaction.type === typeFilter

            const matchesStatus =
                statusFilter === 'All' ||
                transaction.status === statusFilter

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            )
        })
    }, [
        transactions,
        search,
        typeFilter,
        statusFilter
    ])

    const stats = useMemo(() => {
        const completed = transactions.filter(
            (transaction) => transaction.status === 'Completed'
        )

        const deposits = transactions.filter(
            (transaction) => transaction.type === 'Deposit'
        )

        const withdrawals = transactions.filter(
            (transaction) => transaction.type === 'Withdrawal'
        )

        const transfers = transactions.filter(
            (transaction) => transaction.type === 'Transfer'
        )

        return {
            total: transactions.length,
            completed: completed.length,
            deposits: deposits.length,
            withdrawals: withdrawals.length,
            transfers: transfers.length
        }
    }, [transactions])

    const formatDate = (date) => {
        if (!date) return '-'

        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatAmount = (amount) => {
        return Number(amount || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    const getTypeIcon = (type) => {
        if (type === 'Deposit') {
            return (
                <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                    <FiArrowDownLeft
                        className="text-green-600"
                        size={18}
                    />
                </div>
            )
        }

        if (type === 'Withdrawal') {
            return (
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                    <FiArrowUpRight
                        className="text-red-600"
                        size={18}
                    />
                </div>
            )
        }

        return (
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <LuArrowLeftRight
                    className="text-blue-600"
                    size={18}
                />
            </div>
        )
    }

    const getStatusBadge = (status) => {
        if (status === 'Completed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <FiCheckCircle size={13} />
                    Completed
                </span>
            )
        }

        if (status === 'Pending') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                    <FiClock size={13} />
                    Pending
                </span>
            )
        }

        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                <FiAlertCircle size={13} />
                Failed
            </span>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:ml-[20vw]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FiActivity
                                className="text-blue-600"
                                size={23}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Transactions
                            </h1>

                            <p className="text-sm text-gray-500">
                                View and manage all banking transactions
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => fetchTransactions(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    <FiRefreshCw
                        size={17}
                        className={refreshing ? 'animate-spin' : ''}
                    />

                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                            <FiActivity className="text-blue-600" />
                        </div>

                        <span className="text-xs text-gray-400">
                            All
                        </span>
                    </div>

                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {stats.total}
                    </p>

                    <p className="text-sm text-gray-500">
                        Total Transactions
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                            <FiCheckCircle className="text-green-600" />
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {stats.completed}
                    </p>

                    <p className="text-sm text-gray-500">
                        Completed
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                            <FiArrowDownLeft className="text-emerald-600" />
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {stats.deposits}
                    </p>

                    <p className="text-sm text-gray-500">
                        Deposits
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                            <FiArrowUpRight className="text-red-600" />
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {stats.withdrawals}
                    </p>

                    <p className="text-sm text-gray-500">
                        Withdrawals
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                            <LuArrowLeftRight className="text-purple-600" />
                        </div>
                    </div>

                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {stats.transfers}
                    </p>

                    <p className="text-sm text-gray-500">
                        Transfers
                    </p>
                </div>

            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Search */}
                    <div className="relative">
                        <FiSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search transaction ID or account..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Type */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Transaction Types</option>
                        <option value="Deposit">Deposit</option>
                        <option value="Withdrawal">Withdrawal</option>
                        <option value="Transfer">Transfer</option>
                    </select>

                    {/* Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>

                </div>

                <div className="flex items-center justify-between mt-4 text-sm">
                    <p className="text-gray-500">
                        Showing{' '}
                        <span className="font-semibold text-gray-800">
                            {filteredTransactions.length}
                        </span>{' '}
                        transactions
                    </p>

                    {(search || typeFilter !== 'All' || statusFilter !== 'All') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('')
                                setTypeFilter('All')
                                setStatusFilter('All')
                            }}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <FiAlertCircle size={19} />
                    <span>{error}</span>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                {loading ? (
                    <div className="py-20 text-center">
                        <FiRefreshCw
                            className="animate-spin mx-auto text-blue-600 mb-3"
                            size={28}
                        />

                        <p className="text-gray-500">
                            Loading transactions...
                        </p>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="py-20 text-center">

                        <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <FiActivity
                                className="text-gray-400"
                                size={25}
                            />
                        </div>

                        <h3 className="font-semibold text-gray-900">
                            No transactions found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Try changing your search or filters.
                        </p>

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Transaction
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Customer / Account
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Type
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Amount
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Status
                                    </th>

                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Date
                                    </th>

                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredTransactions.map((transaction) => (

                                    <tr
                                        key={transaction._id || transaction.transactionId}
                                        className="hover:bg-gray-50 transition"
                                    >

                                        {/* Transaction */}
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                {getTypeIcon(transaction.type)}

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {transaction.transactionId}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        {transaction.blockchainHash
                                                            ? 'Blockchain recorded'
                                                            : 'No blockchain hash'}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* Account */}
                                        <td className="px-6 py-4">

                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {transaction.type === 'Withdrawal'
                                                        ? transaction.sender?.fullName || 'Unknown Customer'
                                                        : transaction.receiver?.fullName ||
                                                        transaction.sender?.fullName ||
                                                        'Unknown Customer'}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {transaction.type === 'Withdrawal'
                                                        ? transaction.senderAccount
                                                        : transaction.receiverAccount || transaction.senderAccount}
                                                </p>
                                            </div>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {transaction.description || 'No description'}
                                            </p>

                                        </td>

                                        {/* Type */}
                                        <td className="px-6 py-4">

                                            <span className="text-sm font-medium text-gray-700">
                                                {transaction.type}
                                            </span>

                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">

                                            <p className="font-semibold text-gray-900">
                                                ₹{formatAmount(transaction.amount)}
                                            </p>

                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            {getStatusBadge(transaction.status)}
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4">

                                            <p className="text-sm text-gray-600">
                                                {formatDate(transaction.timestamp)}
                                            </p>

                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedTransaction(transaction)
                                                }
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 text-sm font-medium transition"
                                            >
                                                <FiEye size={16} />
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

            {/* Transaction Details Popup */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Transaction Details
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedTransaction.transactionId}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedTransaction(null)}
                                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                                <FiX size={19} />
                            </button>

                        </div>

                        {/* Modal Body */}
                        <div className="p-6">

                            {/* Amount */}
                            <div className="bg-gray-50 rounded-2xl p-6 text-center mb-6">

                                <p className="text-sm text-gray-500 mb-2">
                                    Transaction Amount
                                </p>

                                <p className="text-3xl font-bold text-gray-900">
                                    ₹{formatAmount(selectedTransaction.amount)}
                                </p>

                                <div className="mt-3">
                                    {getStatusBadge(selectedTransaction.status)}
                                </div>

                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiActivity className="text-blue-600" />
                                        <span className="text-xs text-gray-500">
                                            Transaction Type
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.type}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiCalendar className="text-blue-600" />
                                        <span className="text-xs text-gray-500">
                                            Date & Time
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {formatDate(selectedTransaction.timestamp)}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiUser className="text-blue-600" />
                                        <span className="text-xs text-gray-500">
                                            Customer
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.type === 'Withdrawal'
                                            ? selectedTransaction.sender?.fullName || 'Unknown Customer'
                                            : selectedTransaction.receiver?.fullName ||
                                            selectedTransaction.sender?.fullName ||
                                            'Unknown Customer'}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedTransaction.type === 'Withdrawal'
                                            ? selectedTransaction.senderAccount
                                            : selectedTransaction.receiverAccount ||
                                            selectedTransaction.senderAccount}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiUser className="text-blue-600" />
                                        <span className="text-xs text-gray-500">
                                            Processed By
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.processedBy?.fullName || 'Unknown Cashier'}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedTransaction.processedBy?.employeeId || '-'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200 md:col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiDollarSign className="text-blue-600" />
                                        <span className="text-xs text-gray-500">
                                            Description
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.description || 'No description'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200 md:col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiHash className="text-purple-600" />
                                        <span className="text-xs text-gray-500">
                                            Blockchain Hash
                                        </span>
                                    </div>

                                    <p className="font-mono text-sm text-gray-700 break-all">
                                        {selectedTransaction.blockchainHash || 'Not recorded on blockchain'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiActivity className="text-purple-600" />
                                        <span className="text-xs text-gray-500">
                                            Network
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.blockchainNetwork || 'Ganache'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FiHash className="text-purple-600" />
                                        <span className="text-xs text-gray-500">
                                            Block Number
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {selectedTransaction.blockNumber || '-'}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-5 border-t border-gray-200 flex justify-end">

                            <button
                                type="button"
                                onClick={() => setSelectedTransaction(null)}
                                className="px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

export default Transactions