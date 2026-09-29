import React, { useContext, useEffect, useState } from 'react'
import Block from "../../assets/Block.png";
import toast from 'react-hot-toast'
import axios from 'axios'
import {
    LuUser,
    LuIndianRupee,
    LuSend,
    LuReceipt,
    LuShieldCheck,
    LuBlocks,
    LuArrowUpRight,
    LuArrowDownLeft,
    LuLogOut,
} from 'react-icons/lu'

import BankContext from '../../context/BankContext'

const Dashboard = () => {

    const { handleLogout, setCustomerPage, BACKEND_URL } = useContext(BankContext)

    const [customer, setCustomer] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const getDashboardData = async () => {

            try {
                const [customerResponse, transactionResponse] =
                    await Promise.all([
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

                setCustomer(customerResponse.data.customer)

                setTransactions(
                    transactionResponse.data.transactions
                )

            } catch (error) {

                console.error(
                    'Dashboard data error:',
                    error
                )

                toast('Dashboard data error')

            } finally {

                setLoading(false)

            }
        }

        getDashboardData()

    }, [])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center lg:ml-[20vw]">
                <p className="text-gray-500">
                    Loading dashboard...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 lg:ml-[20vw]">
            {/* Header */}

            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-6 py-2 lg:py-4">

                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 p-1 items-center justify-center overflow-hidden rounded-xl">
                            <img
                                src={Block}
                                alt="BlockBank"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        <div>
                            <h1 className="text-sm lg:text-xl font-extrabold tracking-tight text-slate-900">
                                BlockBank
                            </h1>

                            <div className="mt-0.5 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                <p className="text-xs font-medium text-slate-500">
                                    Customer Dashboard
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Right Section */}
                    <div className="flex items-center gap-3">

                        {/* Customer Profile */}
                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-slate-300 hover:bg-slate-100">

                            {/* Avatar */}
                            <div className="flex h-7 lg:h-10 w-7 lg:w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                                {customer?.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div className="hidden min-w-0 sm:block">
                                <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                                    {customer?.fullName || "Customer"}
                                </p>

                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-slate-500">
                                        {customer?.accountNumber || "Account"}
                                    </p>

                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>

                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>


                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-md active:scale-95"
                        >
                            <span className="flex h-5 lg:h-7 w-5 lg:w-7 items-center justify-center rounded-lg bg-slate-100 transition-colors duration-200 group-hover:bg-red-100">
                                <LuLogOut />
                            </span>

                            <span>Logout</span>
                        </button>

                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Welcome */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back, {customer?.fullName}!
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Here's what's happening with your account.
                    </p>
                </div>

                {/* Account Cards */}
                <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">

                    {/* Balance */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <LuIndianRupee />
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Available Balance
                        </p>

                        <h3 className="mt-2 text-lg lg:text-xl font-bold text-gray-800">
                            ₹{Number(customer?.balance || 0).toFixed(2)}
                        </h3>
                    </div>

                    {/* Account Number */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <LuUser />
                        </div>

                        <p className="text-sm text-gray-500">
                            Account Number
                        </p>

                        <h3 className="mt-2 text-lg lg:text-xl font-bold text-gray-800">
                            {customer?.accountNumber}
                        </h3>
                    </div>

                    {/* Transactions */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <LuReceipt />
                        </div>

                        <p className="text-sm text-gray-500">
                            Total Transactions
                        </p>

                        <h3 className="mt-2 text-lg lg:text-xl font-bold text-gray-800">
                            {transactions.length}
                        </h3>
                    </div>

                    {/* Status */}
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <LuShieldCheck />
                        </div>

                        <p className="text-sm text-gray-500">
                            Account Status
                        </p>

                        <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            {customer?.accountStatus || 'Active'}
                        </span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-bold text-gray-800">
                        Quick Actions
                    </h3>

                    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">

                        <div
                            onClick={() => { setCustomerPage("Transfer Money") }}
                            className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <LuSend />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Transfer Money
                                </p>
                                <p className="text-xs text-gray-500">
                                    Send money to another account
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => { setCustomerPage("Transactions") }}
                            className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <LuReceipt />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Transactions
                                </p>
                                <p className="text-xs text-gray-500">
                                    View transaction history
                                </p>
                            </div>
                        </div>

                        <div
                            onClick={() => { setCustomerPage("Profile") }}
                            className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <LuUser />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    My Profile
                                </p>
                                <p className="text-xs text-gray-500">
                                    View your account details
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <LuBlocks />
                            </div>

                            <div>
                                <p className="font-semibold text-gray-800">
                                    Blockchain
                                </p>
                                <p className="text-xs text-gray-500">
                                    Secured by blockchain
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Recent Transactions
                            </h3>
                            <p className="text-sm text-gray-500">
                                Your latest account activity
                            </p>
                        </div>

                        <div
                            onClick={() => setCustomerPage("Transactions")}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                            View All
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full lg:min-w-[520px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-left">
                                    <th className="w-[8%] pb-2 text-[11px] font-semibold text-gray-500 sm:pb-3 sm:text-sm">
                                        #
                                    </th>

                                    <th className="w-[32%] pb-2 text-[11px] font-semibold text-gray-500 sm:pb-3 sm:text-sm">
                                        Type
                                    </th>

                                    <th className="w-[25%] pb-2 text-[11px] font-semibold text-gray-500 sm:pb-3 sm:text-sm">
                                        Amount
                                    </th>

                                    <th className="w-[20%] pb-2 text-[11px] font-semibold text-gray-500 sm:pb-3 sm:text-sm">
                                        Date
                                    </th>

                                    <th className="w-[15%] pb-2 text-right text-[11px] font-semibold text-gray-500 sm:pb-3 sm:text-sm">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="py-6 text-center text-xs text-gray-500 sm:py-8 sm:text-sm"
                                        >
                                            No transactions found.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.slice(0, 5).map((transaction, index) => {
                                        const isSender =
                                            transaction.sender?._id === customer?._id

                                        const isCredit =
                                            transaction.type === 'Deposit' ||
                                            (
                                                transaction.type === 'Transfer' &&
                                                !isSender
                                            )

                                        return (
                                            <tr
                                                key={transaction._id}
                                                className="border-b border-gray-50 last:border-0"
                                            >
                                                {/* Number */}
                                                <td className="py-2.5 text-[11px] text-gray-500 sm:py-4 sm:text-sm">
                                                    {index + 1}
                                                </td>

                                                {/* Type */}
                                                <td className="py-2.5 sm:py-4">
                                                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                                                        <div
                                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${isCredit
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-blue-100 text-blue-600'
                                                                }`}
                                                        >
                                                            {isCredit ? (
                                                                <LuArrowDownLeft
                                                                    size={13}
                                                                    className="sm:h-4 sm:w-4"
                                                                />
                                                            ) : (
                                                                <LuArrowUpRight
                                                                    size={13}
                                                                    className="sm:h-4 sm:w-4"
                                                                />
                                                            )}
                                                        </div>

                                                        <span className="truncate text-[11px] font-medium text-gray-700 sm:text-sm">
                                                            {transaction.type}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Amount */}
                                                <td
                                                    className={`truncate py-2.5 text-[11px] font-semibold sm:py-4 sm:text-sm ${isCredit
                                                        ? 'text-green-600'
                                                        : 'text-gray-800'
                                                        }`}
                                                >
                                                    {isCredit ? '+' : '-'}₹
                                                    {Number(transaction.amount).toFixed(2)}
                                                </td>

                                                {/* Date */}
                                                <td className="truncate py-2.5 text-[10px] text-gray-500 sm:py-4 sm:text-sm">
                                                    {new Date(
                                                        transaction.timestamp
                                                    ).toLocaleDateString('en-IN')}
                                                </td>

                                                {/* Status */}
                                                <td className="py-2.5 text-right sm:py-4">
                                                    <span
                                                        className={`inline-flex max-w-full truncate rounded-full px-1.5 py-0.5 text-[9px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${transaction.status === 'Completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : transaction.status === 'Pending'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        {transaction.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    )
}

export default Dashboard
