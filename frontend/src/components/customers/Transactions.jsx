import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    LuUser,
    LuIndianRupee,
    LuSearch,
    LuFilter,
    LuArrowUpRight,
    LuArrowDownLeft,
    LuCircleCheck,
    LuClock3,
    LuCircleX,
    LuExternalLink,
    LuBlocks,
    LuDownload,
    LuCalendarDays,
    LuSend,
    LuWalletCards,
} from 'react-icons/lu'
import BankContext from '../../context/BankContext';

const Transactions = () => {
    const { setCustomerPage, BACKEND_URL, environment } = useContext(BankContext);
    const [transactions, setTransactions] = useState([])
    const [customer, setCustomer] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [type, setType] = useState('All')
    const [status, setStatus] = useState('All')

    useEffect(() => {

        const getData = async () => {

            try {

                setLoading(true)
                setError('')

                const [
                    customerResponse,
                    transactionResponse
                ] = await Promise.all([

                    axios.get(
                        `${BACKEND_URL}/api/customer/profile`,
                        {
                            withCredentials: true
                        }
                    ),

                    axios.get(
                        `${BACKEND_URL}/api/customer/transactions`,
                        {
                            withCredentials: true
                        }
                    )

                ])

                setCustomer(
                    customerResponse.data.customer
                )

                setTransactions(
                    transactionResponse.data.transactions || []
                )

            } catch (error) {

                console.error(
                    'Get transactions error:',
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

            }

        }

        getData()

    }, [])

    const filteredTransactions = useMemo(() => {

        return transactions.filter((transaction) => {

            const senderName =
                transaction.sender?.fullName ||
                transaction.senderAccount ||
                ''

            const receiverName =
                transaction.receiver?.fullName ||
                transaction.receiverAccount ||
                ''

            const transactionId =
                transaction.transactionId || ''

            const transactionType =
                transaction.type || ''

            const searchText =
                search.toLowerCase()

            const matchesSearch =
                transactionId
                    .toLowerCase()
                    .includes(searchText) ||

                transactionType
                    .toLowerCase()
                    .includes(searchText) ||

                senderName
                    .toLowerCase()
                    .includes(searchText) ||

                receiverName
                    .toLowerCase()
                    .includes(searchText)

            const matchesType =
                type === 'All' ||
                transaction.type === type

            const matchesStatus =
                status === 'All' ||
                transaction.status === status

            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            )

        })

    }, [
        transactions,
        search,
        type,
        status
    ])

    const totalTransactions =
        transactions.length

    const totalSent =
        transactions
            .filter((transaction) => {

                if (transaction.type === 'Withdrawal') {
                    return true
                }

                if (transaction.type === 'Transfer') {
                    return (
                        transaction.sender?._id === customer?._id ||
                        transaction.sender === customer?._id
                    )
                }

                return false

            })
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount || 0),
                0
            )

    const totalReceived =
        transactions
            .filter((transaction) => {

                if (transaction.type === 'Deposit') {
                    return true
                }

                if (transaction.type === 'Transfer') {
                    return (
                        transaction.receiver?._id === customer?._id ||
                        transaction.receiver === customer?._id
                    )
                }

                return false

            })
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount || 0),
                0
            )

    const pendingTransactions =
        transactions.filter(
            (transaction) =>
                transaction.status === 'Pending'
        ).length

    const formatDate = (date) => {

        if (!date) {
            return 'N/A'
        }

        return new Date(date).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }
        )

    }

    const formatTime = (date) => {

        if (!date) {
            return ''
        }

        return new Date(date).toLocaleTimeString(
            'en-IN',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        )

    }

    const getSender = (transaction) => {

        if (transaction.type === 'Deposit') {
            return 'Cashier'
        }

        return (
            transaction.sender?.fullName ||
            transaction.senderAccount ||
            'Unknown'
        )

    }

    const getReceiver = (transaction) => {

        if (transaction.type === 'Withdrawal') {
            return 'Cashier'
        }

        return (
            transaction.receiver?.fullName ||
            transaction.receiverAccount ||
            'Unknown'
        )

    }

    const isCreditTransaction = (transaction) => {

        if (transaction.type === 'Deposit') {
            return true
        }

        if (transaction.type === 'Transfer') {

            return (
                transaction.receiver?._id === customer?._id ||
                transaction.receiver === customer?._id
            )

        }

        return false

    }

    if (loading) {

        return (

            <main className="flex min-h-screen items-center justify-center bg-gray-50 lg:ml-[20vw]">

                <div className="text-center">

                    <div className="
                        mx-auto
                        mb-4
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-gray-200
                        border-t-blue-600
                    "></div>

                    <p className="text-sm text-gray-500">
                        Loading transactions...
                    </p>

                </div>

            </main>

        )

    }

    if (error) {

        return (

            <main className="flex min-h-screen items-center justify-center bg-gray-50 lg:ml-[20vw]">

                <div className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">

                    <p className="font-semibold text-red-600">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                        className="
                            mt-4
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        Try Again
                    </button>

                </div>

            </main>

        )

    }

    return (

        <main className="min-h-screen bg-gray-50 lg:ml-[20vw]">

            <header className="
                hidden
                h-20
                items-center
                justify-end
                border-b
                border-gray-200
                bg-white
                px-8
                lg:flex
            ">

                <div className="flex items-center gap-5">


                    {/* Notification */}

                    <button
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-gray-600
                            transition
                            hover:bg-gray-100
                        "
                    >

                        🔔

                        <span className="
                            absolute
                            right-2
                            top-2
                            h-2
                            w-2
                            rounded-full
                            bg-red-500
                        "></span>

                    </button>


                    {/* Profile */}

                    <div className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-2
                    ">
                        <button
                            type="button"
                            onClick={() =>
                                setCustomerPage("Profile")
                            }
                            className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-2
                            transition
                            hover:bg-gray-50
                        "
                        >

                            <div className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            text-blue-700
                        ">

                                <LuUser size={20} />

                            </div>


                            <div className="text-left">

                                <p className="
                                text-sm
                                font-semibold
                                text-gray-900
                            ">
                                    {customer.fullName}
                                </p>

                                <p className="
                                text-xs
                                text-gray-500
                            ">
                                    Customer
                                </p>

                            </div>

                        </button>

                    </div>

                </div>

            </header>


            {/* ================================================= */}
            {/* PAGE CONTENT */}
            {/* ================================================= */}

            <section className="p-5 sm:p-6 lg:p-8">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div>

                        <h1 className="
                            text-2xl
                            font-bold
                            text-gray-900
                            sm:text-3xl
                        ">
                            Transaction History
                        </h1>

                        <p className="
                            mt-1
                            text-sm
                            text-gray-500
                        ">
                            View and track all your banking transactions.
                        </p>

                    </div>


                    {/* Export */}

                    <button
                        onClick={() => window.print()}
                        className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-gray-700
                            shadow-sm
                            transition
                            hover:border-blue-300
                            hover:bg-blue-50
                            hover:text-blue-600
                        "
                    >

                        <LuDownload size={18} />

                        Export

                    </button>

                </div>


                {/* ================================================= */}
                {/* SUMMARY CARDS */}
                {/* ================================================= */}

                <div className="
                    mt-8
                    grid
                    gap-5
                    grid-cols-2
                    lg:grid-cols-4
                ">


                    {/* Total Transactions */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Transactions
                                </p>

                                <h2 className="
                                    mt-2
                                    text-lg
                                    lg:text-xl
                                    font-bold
                                    text-gray-900
                                ">
                                    {totalTransactions}
                                </h2>

                            </div>


                            <div className="
                                flex
                                h-8
                                w-8
                                p-1
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                            ">

                                <LuWalletCards />

                            </div>

                        </div>

                    </div>


                    {/* Total Sent */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Sent
                                </p>

                                <h2 className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-1
                                    text-lg
                                    lg:text-xl
                                    font-bold
                                    text-gray-900
                                ">

                                    <LuIndianRupee
                                        strokeWidth={3}
                                    />

                                    {totalSent.toFixed(2)}

                                </h2>

                            </div>


                            <div className="
                                flex
                                h-8
                                w-8
                                p-1
                                items-center
                                justify-center
                                rounded-xl
                                bg-red-100
                                text-red-600
                            ">

                                <LuArrowUpRight />

                            </div>

                        </div>

                    </div>


                    {/* Total Received */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Received
                                </p>

                                <h2 className="
                                    mt-2
                                    flex
                                    items-center
                                    gap-1
                                    text-lg
                                    lg:text-xl
                                    font-bold
                                    text-gray-900
                                ">

                                    <LuIndianRupee
                                        strokeWidth={3}
                                    />

                                    {totalReceived.toFixed(2)}

                                </h2>

                            </div>


                            <div className="
                                flex
                                h-8
                                w-8
                                p-1
                                items-center
                                justify-center
                                rounded-xl
                                bg-green-100
                                text-green-600
                            ">

                                <LuArrowDownLeft />

                            </div>

                        </div>

                    </div>


                    {/* Pending */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-5
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                        ">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Pending
                                </p>

                                <h2 className="
                                    mt-2
                                    text-lg
                                    lg:text-xl
                                    font-bold
                                    text-orange-500
                                ">
                                    {pendingTransactions}
                                </h2>

                            </div>


                            <div className="
                                flex
                                h-8
                                w-8
                                p-1
                                items-center
                                justify-center
                                rounded-xl
                                bg-orange-100
                                text-orange-600
                            ">

                                <LuClock3 />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* FILTER BAR */}
                {/* ================================================= */}

                <div className="
                    mt-6
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                ">

                    <div className="
                        flex
                        flex-col
                        gap-4
                        lg:flex-row
                        lg:items-center
                    ">


                        {/* Search */}

                        <div className="
                            relative
                            flex-1
                        ">

                            <LuSearch
                                size={19}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <input
                                type="text"
                                placeholder="Search transaction ID, type, sender or receiver..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-2
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>


                        {/* Type */}

                        <div className="relative">

                            <LuFilter
                                size={17}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />

                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value)
                                }
                                className="
                                    min-w-[160px]
                                    appearance-none
                                    rounded-lg
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    py-3
                                    pl-10
                                    pr-8
                                    text-sm
                                    text-gray-700
                                    outline-none
                                    focus:border-blue-500
                                "
                            >

                                <option value="All">
                                    All Types
                                </option>

                                <option value="Deposit">
                                    Deposit
                                </option>

                                <option value="Transfer">
                                    Transfer
                                </option>

                                <option value="Withdrawal">
                                    Withdrawal
                                </option>

                            </select>

                        </div>


                        {/* Status */}

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value)
                            }
                            className="
                                min-w-[150px]
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                px-4
                                py-3
                                text-sm
                                text-gray-700
                                outline-none
                                focus:border-blue-500
                            "
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


                        {/* Date */}

                        <button
                            type="button"
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-gray-200
                                bg-gray-50
                                px-4
                                py-3
                                text-sm
                                text-gray-600
                            "
                        >

                            <LuCalendarDays size={17} />

                            Date

                        </button>

                    </div>

                </div>


                {/* ================================================= */}
                {/* TRANSACTION TABLE */}
                {/* ================================================= */}

                <div className="
                    mt-6
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    shadow-sm
                ">


                    {/* Table Header */}

                    <div className="
                        flex
                        flex-col
                        gap-2
                        border-b
                        border-gray-100
                        p-6
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    ">

                        <div>

                            <h2 className="
                                text-lg
                                font-bold
                                text-gray-900
                            ">
                                All Transactions
                            </h2>

                            <p className="
                                mt-1
                                text-sm
                                text-gray-500
                            ">
                                Showing {filteredTransactions.length} transactions
                            </p>

                        </div>


                        <div className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-gray-500
                        ">

                            <LuBlocks
                                size={16}
                                className="text-blue-600"
                            />

                            Blockchain records

                        </div>

                    </div>


                    {/* Table */}

                    <div className="overflow-x-auto">

                        <table className="
                            w-full
                            min-w-[1000px]
                            text-left
                        ">


                            <thead>

                                <tr className="
                                    border-b
                                    border-gray-100
                                    bg-gray-50
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-gray-400
                                ">

                                    <th className="px-6 py-4 font-semibold">
                                        Transaction
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Type
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Sender / Receiver
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Date & Time
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 font-semibold">
                                        Blockchain
                                    </th>

                                </tr>

                            </thead>


                            <tbody>


                                {/* ================================================= */}
                                {/* TRANSACTIONS */}
                                {/* ================================================= */}

                                {filteredTransactions.map(
                                    (transaction) => {

                                        const isCredit =
                                            isCreditTransaction(
                                                transaction
                                            )

                                        const transactionId =
                                            transaction.transactionId ||
                                            transaction._id

                                        const blockchainHash =
                                            transaction.blockchainHash

                                        return (

                                            <tr
                                                key={transaction._id}
                                                className="
                                                    border-b
                                                    border-gray-50
                                                    transition
                                                    hover:bg-gray-50
                                                    last:border-0
                                                "
                                            >


                                                {/* Transaction ID */}

                                                <td className="px-6 py-5">

                                                    <div>

                                                        <p className="
                                                            text-sm
                                                            font-semibold
                                                            text-gray-900
                                                        ">
                                                            {transactionId}
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                            Banking Transaction
                                                        </p>

                                                    </div>

                                                </td>


                                                {/* Type */}

                                                <td className="px-6 py-5">

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div
                                                            className={`
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                ${isCredit
                                                                    ? 'bg-green-100 text-green-600'
                                                                    : 'bg-blue-100 text-blue-600'
                                                                }
                                                            `}
                                                        >

                                                            {transaction.type === 'Deposit' && (
                                                                <LuArrowDownLeft size={18} />
                                                            )}

                                                            {transaction.type === 'Transfer' && (
                                                                <LuSend size={17} />
                                                            )}

                                                            {transaction.type === 'Withdrawal' && (
                                                                <LuArrowUpRight size={18} />
                                                            )}

                                                        </div>


                                                        <span className="
                                                            text-sm
                                                            font-medium
                                                            text-gray-700
                                                        ">
                                                            {transaction.type}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* Sender / Receiver */}

                                                <td className="px-6 py-5">

                                                    <div className="text-sm">

                                                        <p className="
                                                            font-medium
                                                            text-gray-800
                                                        ">
                                                            {getSender(transaction)}
                                                        </p>

                                                        <p className="
                                                            mt-1
                                                            text-xs
                                                            text-gray-400
                                                        ">
                                                            To: {getReceiver(transaction)}
                                                        </p>

                                                    </div>

                                                </td>


                                                {/* Amount */}

                                                <td className="px-6 py-5">

                                                    <p
                                                        className={`
                                                            flex
                                                            items-center
                                                            gap-1
                                                            text-sm
                                                            font-bold
                                                            ${isCredit
                                                                ? 'text-green-600'
                                                                : 'text-gray-900'
                                                            }
                                                        `}
                                                    >

                                                        {isCredit
                                                            ? '+'
                                                            : '-'
                                                        }

                                                        <LuIndianRupee
                                                            size={15}
                                                            strokeWidth={3}
                                                        />

                                                        {Number(
                                                            transaction.amount || 0
                                                        ).toFixed(2)}

                                                    </p>

                                                </td>


                                                {/* Date */}

                                                <td className="px-6 py-5">

                                                    <p className="
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                    ">
                                                        {formatDate(
                                                            transaction.timestamp ||
                                                            transaction.createdAt
                                                        )}
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        {formatTime(
                                                            transaction.timestamp ||
                                                            transaction.createdAt
                                                        )}
                                                    </p>

                                                </td>


                                                {/* Status */}

                                                <td className="px-6 py-5">

                                                    {transaction.status === 'Completed' && (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            bg-green-100
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-green-700
                                                        ">

                                                            <LuCircleCheck size={14} />

                                                            Completed

                                                        </span>

                                                    )}


                                                    {transaction.status === 'Pending' && (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            bg-orange-100
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-orange-700
                                                        ">

                                                            <LuClock3 size={14} />

                                                            Pending

                                                        </span>

                                                    )}


                                                    {transaction.status === 'Failed' && (

                                                        <span className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            bg-red-100
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-semibold
                                                            text-red-700
                                                        ">

                                                            <LuCircleX size={14} />

                                                            Failed

                                                        </span>

                                                    )}

                                                </td>


                                                {/* Blockchain */}

                                                <td className="px-6 py-5">

                                                    {blockchainHash ? (

                                                        <a
                                                            href={
                                                                environment === "production"
                                                                    ? `https://sepolia.etherscan.io/tx/${blockchainHash}`
                                                                    : undefined
                                                            }
                                                            target={environment === "production" ? "_blank" : undefined}
                                                            rel={environment === "production" ? "noopener noreferrer" : undefined}
                                                            className="group flex items-center gap-2 text-left"
                                                        >

                                                            <LuBlocks
                                                                size={17}
                                                                className="text-blue-600"
                                                            />

                                                            <div>

                                                                <p className="
                                                                    max-w-[130px]
                                                                    truncate
                                                                    text-xs
                                                                    font-semibold
                                                                    text-blue-600
                                                                    group-hover:underline
                                                                ">
                                                                    {blockchainHash}
                                                                </p>

                                                                <p className="
                                                                    mt-0.5
                                                                    flex
                                                                    items-center
                                                                    gap-1
                                                                    text-[10px]
                                                                    text-gray-400
                                                                ">
                                                                    {transaction.blockchainNetwork || 'Ganache'}

                                                                    <LuExternalLink size={10} />
                                                                </p>

                                                            </div>

                                                        </a>

                                                    ) : (

                                                        <div className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            text-gray-400
                                                        ">

                                                            <LuBlocks size={17} />

                                                            Not recorded

                                                        </div>

                                                    )}

                                                </td>

                                            </tr>

                                        )

                                    }
                                )}


                                {/* ================================================= */}
                                {/* EMPTY STATE */}
                                {/* ================================================= */}

                                {filteredTransactions.length === 0 && (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="
                                                px-6
                                                py-16
                                                text-center
                                            "
                                        >

                                            <LuSearch
                                                size={40}
                                                className="
                                                    mx-auto
                                                    text-gray-300
                                                "
                                            />

                                            <p className="
                                                mt-3
                                                font-semibold
                                                text-gray-700
                                            ">
                                                No transactions found
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                text-gray-400
                                            ">
                                                Try changing your search or filters.
                                            </p>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <div className="
                        border-t
                        border-gray-100
                        p-5
                    ">

                        <p className="
                            text-sm
                            text-gray-500
                        ">

                            Showing{' '}

                            <span className="
                                font-semibold
                                text-gray-700
                            ">
                                {filteredTransactions.length}
                            </span>{' '}

                            of{' '}

                            <span className="
                                font-semibold
                                text-gray-700
                            ">
                                {transactions.length}
                            </span>{' '}

                            transactions

                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* BLOCKCHAIN INFORMATION */}
                {/* ================================================= */}

                <div className="
                    mt-6
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-blue-100
                    bg-blue-50
                    p-6
                    sm:flex-row
                    sm:items-center
                ">

                    <div className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        text-blue-600
                    ">

                        <LuBlocks size={25} />

                    </div>


                    <div>

                        <h3 className="
                            font-bold
                            text-blue-950
                        ">
                            Blockchain-Powered Transaction Records
                        </h3>

                        <p className="
                            mt-1
                            max-w-3xl
                            text-sm
                            leading-6
                            text-blue-900/60
                        ">
                            Every completed transaction is recorded on the
                            blockchain with a unique transaction hash.
                            This provides a transparent and tamper-resistant
                            transaction history.
                        </p>

                    </div>

                </div>


            </section>

        </main>
    )
}

export default Transactions