import React, {
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'

import axios from 'axios'
import toast from 'react-hot-toast'
import {
    FiSearch,
    FiActivity,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiRefreshCw,
    FiEye,
    FiX,
    FiCreditCard
} from 'react-icons/fi'

import {
    FaShieldAlt,
    FaTimes,
    FaArrowRight,
    FaLink,
    FaFingerprint,
    FaExclamationTriangle
} from 'react-icons/fa'
import BankContext from '../../context/BankContext'

const Transactions = () => {
    const { BACKEND_URL, environment } = useContext(BankContext);

    const [transactions, setTransactions] =
        useState([])

    const [search, setSearch] =
        useState('')

    const [typeFilter, setTypeFilter] =
        useState('All')

    const [statusFilter, setStatusFilter] =
        useState('All')

    const [selectedTransaction, setSelectedTransaction] =
        useState(null)

    // Blockchain transaction fetched from Ganache
    const [blockchainTransaction, setBlockchainTransaction] =
        useState(null)

    // Blockchain loading state
    const [blockchainLoading, setBlockchainLoading] =
        useState(false)

    const [loading, setLoading] =
        useState(true)

    const [refreshing, setRefreshing] =
        useState(false)

    const [error, setError] =
        useState('')


    // ==========================================
    // FETCH TRANSACTIONS FROM MONGODB
    // ==========================================

    const fetchTransactions = async (
        refresh = false
    ) => {

        try {

            if (refresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/admin/transactions`,
                {
                    withCredentials: true
                }
            )

            setTransactions(
                response.data.transactions
            )

        } catch (error) {

            console.error(
                'Fetch transactions error:',
                error
            )

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


    // ==========================================
    // FETCH SINGLE TRANSACTION FROM BLOCKCHAIN
    // ==========================================

    const fetchBlockchainTransaction = async (
        transaction
    ) => {

        try {

            setBlockchainLoading(true)

            setBlockchainTransaction(null)

            setSelectedTransaction(transaction)

            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/admin/transactions/${transaction._id}/blockchain`,
                {
                    withCredentials: true
                }
            )

            setBlockchainTransaction(
                response.data.transaction
            )

        } catch (error) {

            console.error(
                'Fetch blockchain transaction error:',
                error
            )

            const message =
                error.response?.data?.message ||
                'Failed to fetch transaction from blockchain'

            toast.error(message)

            setBlockchainTransaction(null)

        } finally {

            setBlockchainLoading(false)

        }
    }


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchTransactions()

    }, [])


    // ==========================================
    // STATISTICS
    // ==========================================

    const totalTransactions =
        transactions.length


    const completedTransactions =
        transactions.filter(
            transaction =>
                transaction.status === 'Completed'
        ).length


    const pendingTransactions =
        transactions.filter(
            transaction =>
                transaction.status === 'Pending'
        ).length


    const failedTransactions =
        transactions.filter(
            transaction =>
                transaction.status === 'Failed'
        ).length


    const totalAmount =
        transactions
            .filter(
                transaction =>
                    transaction.status === 'Completed'
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Number(
                        transaction.amount || 0
                    ),
                0
            )


    // ==========================================
    // FILTER
    // ==========================================

    const filteredTransactions =
        useMemo(() => {

            const searchValue =
                search.trim().toLowerCase()


            return transactions.filter(
                transaction => {

                    const senderName =
                        transaction.sender?.fullName ||
                        ''

                    const receiverName =
                        transaction.receiver?.fullName ||
                        ''

                    const senderAccount =
                        transaction.sender?.accountNumber ||
                        transaction.senderAccount ||
                        ''

                    const receiverAccount =
                        transaction.receiver?.accountNumber ||
                        transaction.receiverAccount ||
                        ''

                    const cashierName =
                        transaction.processedBy?.fullName ||
                        ''


                    const matchesSearch =
                        !searchValue ||

                        transaction.transactionId
                            ?.toLowerCase()
                            .includes(searchValue) ||

                        senderName
                            .toLowerCase()
                            .includes(searchValue) ||

                        receiverName
                            .toLowerCase()
                            .includes(searchValue) ||

                        senderAccount
                            .toLowerCase()
                            .includes(searchValue) ||

                        receiverAccount
                            .toLowerCase()
                            .includes(searchValue) ||

                        cashierName
                            .toLowerCase()
                            .includes(searchValue)


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
                }
            )

        }, [
            transactions,
            search,
            typeFilter,
            statusFilter
        ])


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = amount => {

        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        )
    }


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = date => {

        if (!date) {
            return '-'
        }

        return new Date(date).toLocaleString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        )
    }


    // ==========================================
    // CUSTOMER NAME
    // ==========================================

    const getCustomerName = transaction => {

        if (transaction.type === 'Deposit') {

            return (
                transaction.receiver?.fullName ||
                'Unknown Customer'
            )
        }


        if (transaction.type === 'Withdrawal') {

            return (
                transaction.sender?.fullName ||
                'Unknown Customer'
            )
        }


        return (
            transaction.sender?.fullName ||
            transaction.receiver?.fullName ||
            'Unknown Customer'
        )
    }


    // ==========================================
    // ACCOUNT NUMBER
    // ==========================================

    const getAccountNumber = transaction => {

        if (transaction.type === 'Deposit') {

            return (
                transaction.receiver?.accountNumber ||
                transaction.receiverAccount ||
                '-'
            )
        }


        if (transaction.type === 'Withdrawal') {

            return (
                transaction.sender?.accountNumber ||
                transaction.senderAccount ||
                '-'
            )
        }


        return (
            transaction.sender?.accountNumber ||
            transaction.senderAccount ||
            '-'
        )
    }


    // ==========================================
    // TYPE STYLE
    // ==========================================

    const getTypeStyle = type => {

        if (type === 'Deposit') {
            return 'bg-green-100 text-green-700'
        }

        if (type === 'Withdrawal') {
            return 'bg-red-100 text-red-700'
        }

        if (type === 'Transfer') {
            return 'bg-blue-100 text-blue-700'
        }

        return 'bg-slate-100 text-slate-600'
    }


    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = status => {

        if (status === 'Completed') {
            return 'bg-green-100 text-green-700'
        }

        if (status === 'Pending') {
            return 'bg-yellow-100 text-yellow-700'
        }

        if (status === 'Failed') {
            return 'bg-red-100 text-red-700'
        }

        return 'bg-slate-100 text-slate-600'
    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="text-center">

                        <FiRefreshCw
                            size={30}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-3 text-sm text-slate-500">
                            Loading transactions...
                        </p>

                    </div>

                </div>

            </main>
        )
    }

    return (

        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            <section className="p-6 lg:p-8">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Transactions
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            View all BlockBank transactions
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            fetchTransactions(true)
                        }
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >

                        <FiRefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? 'animate-spin'
                                    : ''
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                        {error}

                    </div>

                )}


                {/* ==================================
                    STATS
                ================================== */}

                <div className="grid gap-5 grid-cols-2 lg:grid-cols-5">


                    <StatCard
                        title="Total Transactions"
                        value={totalTransactions}
                        icon={
                            <FiActivity />
                        }
                    />


                    <StatCard
                        title="Completed"
                        value={completedTransactions}
                        valueClass="text-green-600"
                        icon={
                            <FiActivity />
                        }
                    />


                    <StatCard
                        title="Pending"
                        value={pendingTransactions}
                        valueClass="text-yellow-600"
                        icon={
                            <FiActivity />
                        }
                    />


                    <StatCard
                        title="Failed"
                        value={failedTransactions}
                        valueClass="text-red-600"
                        icon={
                            <FiActivity />
                        }
                    />


                    <StatCard
                        title="Completed Amount"
                        value={formatMoney(totalAmount)}
                        icon={
                            <FiCreditCard />
                        }
                    />

                </div>


                {/* ==================================
                    TRANSACTION TABLE
                ================================== */}

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">


                    {/* Filters */}

                    <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row">

                        {/* Search */}

                        <div className="relative flex-1">

                            <FiSearch
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={e =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search transaction, customer, account..."
                                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Type */}

                        <select
                            value={typeFilter}
                            onChange={e =>
                                setTypeFilter(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="All">
                                All Types
                            </option>

                            <option value="Deposit">
                                Deposit
                            </option>

                            <option value="Withdrawal">
                                Withdrawal
                            </option>

                            <option value="Transfer">
                                Transfer
                            </option>

                        </select>


                        {/* Status */}

                        <select
                            value={statusFilter}
                            onChange={e =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Failed">
                                Failed
                            </option>

                        </select>

                    </div>


                    {/* Empty */}

                    {filteredTransactions.length === 0 ? (

                        <div className="p-12 text-center">

                            <FiActivity
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 font-semibold text-slate-600">
                                No transactions found
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Try changing your search or filters
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1100px]">

                                <thead>

                                    <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">

                                        <th className="px-5 py-4">
                                            Transaction
                                        </th>

                                        <th className="px-5 py-4">
                                            Customer
                                        </th>

                                        <th className="px-5 py-4">
                                            Account
                                        </th>

                                        <th className="px-5 py-4">
                                            Type
                                        </th>

                                        <th className="px-5 py-4">
                                            Amount
                                        </th>

                                        <th className="px-5 py-4">
                                            Status
                                        </th>

                                        <th className="px-5 py-4">
                                            Processed By
                                        </th>

                                        <th className="px-12 py-4">
                                            Date
                                        </th>

                                        <th className="px-5 py-4">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredTransactions.map(
                                        transaction => (

                                            <tr
                                                key={
                                                    transaction._id
                                                }
                                                className="border-b border-slate-100 transition hover:bg-slate-50"
                                            >

                                                <td className="px-5 py-4">

                                                    <p className="font-semibold text-slate-800">
                                                        {
                                                            transaction.transactionId
                                                        }
                                                    </p>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <p className="font-medium text-slate-700">
                                                        {
                                                            getCustomerName(
                                                                transaction
                                                            )
                                                        }
                                                    </p>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <p className="font-mono text-sm text-slate-600">
                                                        {
                                                            getAccountNumber(
                                                                transaction
                                                            )
                                                        }
                                                    </p>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getTypeStyle(
                                                            transaction.type
                                                        )}`}
                                                    >

                                                        {transaction.type ===
                                                            'Deposit' ? (

                                                            <FiArrowDownLeft />

                                                        ) : transaction.type ===
                                                            'Withdrawal' ? (

                                                            <FiArrowUpRight />

                                                        ) : (

                                                            <FiActivity />

                                                        )}

                                                        {
                                                            transaction.type
                                                        }

                                                    </span>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <p className="font-semibold text-slate-800">

                                                        {formatMoney(
                                                            transaction.amount
                                                        )}

                                                    </p>

                                                </td>


                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                            transaction.status
                                                        )}`}
                                                    >

                                                        {
                                                            transaction.status
                                                        }

                                                    </span>

                                                </td>


                                                <td className="px-5 py-4">

                                                    {transaction.processedBy ? (

                                                        <div>

                                                            <p className="text-sm font-medium text-slate-700">

                                                                {
                                                                    transaction
                                                                        .processedBy
                                                                        .fullName
                                                                }

                                                            </p>

                                                            <p className="text-xs text-slate-400">

                                                                {
                                                                    transaction
                                                                        .processedBy
                                                                        .employeeId
                                                                }

                                                            </p>

                                                        </div>

                                                    ) : (

                                                        <span className="text-sm text-slate-400">
                                                            Customer
                                                        </span>

                                                    )}

                                                </td>


                                                <td className="px-5 py-4 text-sm text-slate-500">

                                                    {formatDate(
                                                        transaction.timestamp
                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <button
                                                        onClick={() =>
                                                            fetchBlockchainTransaction(
                                                                transaction
                                                            )
                                                        }
                                                        disabled={
                                                            blockchainLoading
                                                        }
                                                        className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 disabled:opacity-50"
                                                    >

                                                        <FiEye size={16} />

                                                        View

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </section>


            {/* ==================================
                DETAILS MODAL
            ================================== */}

            {selectedTransaction && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedTransaction(null)}
                >
                    <div
                        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* ================= HEADER ================= */}
                        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 px-6 py-7 text-white">
                            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                            <div className="absolute -bottom-20 left-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                                        <FaShieldAlt className="text-2xl text-emerald-400" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold">
                                                Transaction Details
                                            </h2>

                                            <span className="rounded-full hidden lg:block bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/20">
                                                Blockchain Verified
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm text-slate-300">
                                            Secure transaction record & blockchain verification
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedTransaction(null)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* ================= BODY ================= */}
                        <div className="space-y-6 p-6">

                            {/* ================= AMOUNT CARD ================= */}
                            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Transaction Amount
                                        </p>

                                        <h3 className="mt-1 text-4xl font-extrabold tracking-tight text-slate-900">
                                            ₹{Number(selectedTransaction.amount || 0).toLocaleString('en-IN', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}
                                        </h3>

                                        <p className="mt-2 text-xs text-slate-400">
                                            MongoDB transaction record
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-semibold ${selectedTransaction.status === 'Completed'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : selectedTransaction.status === 'Failed'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                }`}
                                        >
                                            {selectedTransaction.status || 'Pending'}
                                        </span>

                                        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                                            {selectedTransaction.type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* ================= SENDER / RECEIVER ================= */}
                            <div>
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-600" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                        Transaction Flow
                                    </h3>
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">

                                        {/* Sender */}
                                        <div className="rounded-2xl bg-slate-50 p-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Sender
                                            </p>

                                            <p className="mt-2 text-lg font-bold text-slate-800">
                                                {selectedTransaction.sender?.fullName || selectedTransaction.senderAccount || 'Unknown Sender'}
                                            </p>

                                            <p className="mt-1 break-all font-mono text-sm text-slate-500">
                                                {blockchainTransaction?.senderAccount ||
                                                    selectedTransaction.senderAccount ||
                                                    '—'}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex justify-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                                                <FaArrowRight />
                                            </div>
                                        </div>

                                        {/* Receiver */}
                                        <div className="rounded-2xl bg-slate-50 p-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Receiver
                                            </p>

                                            <p className="mt-2 text-lg font-bold text-slate-800">
                                                {selectedTransaction.receiver?.fullName || selectedTransaction.receiverAccount || 'Unknown Receiver'}
                                            </p>

                                            <p className="mt-1 break-all font-mono text-sm text-slate-500">
                                                {blockchainTransaction?.receiverAccount ||
                                                    selectedTransaction.receiverAccount ||
                                                    '—'}
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* ================= BLOCKCHAIN VERIFICATION ================= */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                                            <FaLink className="text-sm text-emerald-600" />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                Blockchain Verification
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                Data retrieved directly from BlockBank on Ganache
                                            </p>
                                        </div>
                                    </div>

                                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                        Verified
                                    </span>
                                </div>

                                {blockchainLoading ? (
                                    <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-12">
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                                            <span className="text-sm font-medium">
                                                Reading blockchain data...
                                            </span>
                                        </div>
                                    </div>
                                ) : blockchainTransaction ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                                        {/* Blockchain Transaction ID */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Blockchain Transaction ID
                                            </p>
                                            <p className="mt-2 font-mono text-lg font-bold text-slate-800">
                                                #{blockchainTransaction.transactionId ?? '—'}
                                            </p>
                                        </div>

                                        {/* Type */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Blockchain Type
                                            </p>
                                            <p className="mt-2 text-lg font-bold text-indigo-700">
                                                {blockchainTransaction.transactionType || '—'}
                                            </p>
                                        </div>

                                        {/* Sender */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Blockchain Sender
                                            </p>
                                            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800">
                                                {blockchainTransaction.senderAccount || '—'}
                                            </p>
                                        </div>

                                        {/* Receiver */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Blockchain Receiver
                                            </p>
                                            <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-800">
                                                {blockchainTransaction.receiverAccount || '—'}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                                            <p className="text-xs font-medium text-emerald-600">
                                                Blockchain Amount
                                            </p>
                                            <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                                                ₹{Number(blockchainTransaction.amount || 0).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })}
                                            </p>
                                        </div>

                                        {/* Block Number */}
                                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                                            <p className="text-xs font-medium text-blue-600">
                                                Blockchain Block Number
                                            </p>
                                            <p className="mt-2 font-mono text-2xl font-extrabold text-blue-700">
                                                {blockchainTransaction.blockNumber ?? '—'}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Description
                                            </p>
                                            <p className="mt-2 font-medium text-slate-800">
                                                {blockchainTransaction.description || 'No description'}
                                            </p>
                                        </div>

                                        {/* Timestamp */}
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-slate-400">
                                                Blockchain Timestamp
                                            </p>
                                            <p className="mt-2 font-medium text-slate-800">
                                                {blockchainTransaction.timestamp
                                                    ? new Date(
                                                        Number(blockchainTransaction.timestamp) * 1000
                                                    ).toLocaleString('en-IN')
                                                    : '—'}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <div className="flex items-center gap-3">
                                            <FaExclamationTriangle className="text-amber-500" />

                                            <div>
                                                <p className="font-semibold text-amber-800">
                                                    Blockchain data unavailable
                                                </p>

                                                <p className="mt-1 text-sm text-amber-700">
                                                    The MongoDB transaction was found, but blockchain
                                                    verification data could not be loaded.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ================= BLOCKCHAIN HASH ================= */}
                            {selectedTransaction.blockchainHash && (
                                <div className="rounded-2xl bg-slate-950 p-5 text-white">
                                    <div className="flex items-center gap-2">
                                        <FaFingerprint className="text-emerald-400" />

                                        <p className="text-sm font-bold">
                                            Blockchain Transaction Hash
                                        </p>
                                    </div>

                                    <div className="mt-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                                        <p className="break-all font-mono text-xs leading-6 text-slate-300">
                                            {selectedTransaction.blockchainHash}
                                        </p>
                                    </div>

                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <span>
                                            Network:
                                            <span className="ml-1 font-semibold text-slate-200">
                                                {selectedTransaction.blockchainNetwork || 'Sepolia'}
                                            </span>
                                        </span>

                                        <span>•</span>

                                        <span>
                                            Block:
                                            <span className="ml-1 font-semibold text-slate-200">
                                                {blockchainTransaction?.blockNumber ||
                                                    selectedTransaction.blockNumber ||
                                                    '—'}
                                            </span>
                                        </span>
                                    </div>

                                    {selectedTransaction.blockchainHash && environment === "production" && (
                                        <a
                                            href={`https://sepolia.etherscan.io/tx/${selectedTransaction.blockchainHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
                                        >
                                            <FaFingerprint />
                                            Verify on Sepolia Etherscan
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* ================= FOOTER ================= */}
                            <div className="flex justify-end border-t border-slate-200 pt-5">
                                <button
                                    onClick={() => setSelectedTransaction(null)}
                                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </main>
    )
}


// ==========================================
// STAT CARD
// ==========================================

const StatCard = ({
    title,
    value,
    icon,
    valueClass = 'text-slate-900'
}) => {

    return (

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <h2
                        className={`mt-2 text:lg lg:text-xl font-bold ${valueClass}`}
                    >
                        {value}
                    </h2>

                </div>


                <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    {icon}

                </div>

            </div>

        </div>
    )
}

export default Transactions