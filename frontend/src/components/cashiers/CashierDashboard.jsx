import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    FiUsers,
    FiUserPlus,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiActivity,
    FiUser,
    FiShield,
    FiLogOut,
    FiKey
} from 'react-icons/fi'

import BankContext from '../../context/BankContext'
import { LuArrowLeftRight } from 'react-icons/lu'

const CashierDashboard = () => {
    const { handleLogout, setCashierPage, setSelectedCustomerAccount, BACKEND_URL } = useContext(BankContext);

    const [cashier, setCashier] = useState(null)

    const [stats, setStats] = useState({
        customers: 0,
        todayDeposits: 0,
        todayWithdrawals: 0,
        transactions: 0
    })

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await axios.get(
                    `${BACKEND_URL}/api/cashier/dashboard`,
                    {
                        withCredentials: true
                    }
                )

                setCashier(response.data.cashier)
                setStats(response.data.stats)

            } catch (error) {
                console.error('Dashboard error:', error)

                toast.error(
                    error.response?.data?.message ||
                    'Failed to load dashboard'
                )

                setError(
                    error.response?.data?.message ||
                    'Failed to load dashboard'
                )
            } finally {
                setLoading(false)
            }
        }

        getDashboardData()
    }, [])

    const menuItems = [
        {
            icon: <FiUserPlus size={23} />,
            title: "Create Customer",
            text: "Open a new customer account",
            iconClass: "bg-blue-100 text-blue-600"
        },
        {
            icon: <FiArrowDownLeft size={23} />,
            title: "Deposit",
            text: "Deposit money to customer",
            iconClass: "bg-emerald-100 text-emerald-600"
        },
        {
            icon: <FiArrowUpRight size={23} />,
            title: "Withdrawal",
            text: "Process customer withdrawal",
            iconClass: "bg-red-100 text-red-600"
        },
        {
            icon: <FiUsers size={23} />,
            title: "Customers",
            text: "Search customer accounts",
            iconClass: "bg-purple-100 text-purple-600"
        },
        {
            icon: <LuArrowLeftRight size={23} />,
            title: "Transactions",
            text: "View processed transactions",
            iconClass: "bg-slate-100 text-slate-600"
        }
    ]

    const statCards = [
        {
            title: 'Customers',
            value: stats.customers,
            text: 'Registered customers',
            icon: <FiUsers size={22} />
        },
        {
            title: 'Today Deposits',
            value: `₹${Number(stats.todayDeposits).toLocaleString('en-IN', {
                minimumFractionDigits: 2
            })}`,
            text: 'Total deposits',
            icon: <FiArrowDownLeft size={22} />
        },
        {
            title: 'Today Withdrawals',
            value: `₹${Number(stats.todayWithdrawals).toLocaleString('en-IN', {
                minimumFractionDigits: 2
            })}`,
            text: 'Total withdrawals',
            icon: <FiArrowUpRight size={22} />
        },
        {
            title: 'Transactions',
            value: stats.transactions,
            text: 'Processed today',
            icon: <FiActivity size={22} />
        }
    ]

    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}
            <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

                {/* Left: Page Information */}
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight text-slate-900">
                            Cashier Panel
                        </h2>

                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                            Staff
                        </span>
                    </div>

                    <p className="mt-0.5 text-sm text-slate-500">
                        Manage customer banking operations
                    </p>
                </div>


                {/* Right: Cashier Profile + Logout */}
                <div className="flex items-center gap-3">

                    {/* Cashier Profile */}
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">

                        {/* Avatar */}
                        <div className="relative">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
                                <FiUser size={19} />
                            </div>

                            {/* Online Indicator */}
                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-50 bg-emerald-500" />
                        </div>

                        {/* Details */}
                        <div className="min-w-[100px]">
                            <div className="min-w-[140px]">
                                <p className="text-sm font-bold leading-5 text-slate-900">
                                    {cashier?.fullName || 'Cashier'}
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs text-slate-500">
                                        {cashier?.employeeId || '---'}
                                    </p>

                                    <span className="h-1 w-1 rounded-full bg-slate-300" />

                                    <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                                        {cashier?.status || 'Active'}
                                    </span>
                                </div>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    {cashier?.branch || 'Branch'}
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Divider */}
                    <div className="h-8 w-px bg-slate-200" />

                    <button
                        onClick={() => setCashierPage('Change Password')}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-100">
                            <FiKey size={16} />
                        </span>

                        <span>Change Password</span>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-red-100">
                            <FiLogOut
                                size={16}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                            />
                        </span>

                        <span>Logout</span>
                    </button>

                </div>

            </header>
            <section className="p-6 lg:p-8">

                {loading ? (
                    <div className="flex min-h-[500px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Loading dashboard...
                            </p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                        <p className="font-semibold text-red-700">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">

                            <h1 className="text-2xl font-bold text-slate-900">
                                Dashboard
                            </h1>

                            <p className="mt-1 text-slate-500">
                                Welcome back. Manage customer accounts and transactions.
                            </p>

                        </div>

                        {/* Stats */}
                        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">

                            {statCards.map((stat, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {stat.title}
                                            </p>

                                            <h2 className="mt-2 text-lg lg:text-xl font-bold text-slate-900">
                                                {stat.value}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {stat.text}
                                            </p>
                                        </div>

                                        <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            {stat.icon}
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Actions */}
                        <div className="mt-8">

                            <h2 className="mb-4 text-lg font-bold text-slate-900">
                                Banking Operations
                            </h2>

                            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                                {
                                    menuItems.map((item, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setCashierPage(item.title);
                                                setSelectedCustomerAccount("");
                                            }}
                                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                        >
                                            <div
                                                className={`mb-4 flex h-8 w-8 p-1 items-center justify-center rounded-xl ${item.iconClass}`}
                                            >
                                                {item.icon}
                                            </div>

                                            <h3 className="font-semibold text-slate-900">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                        {/* Security */}
                        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <FiShield size={23} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-blue-950">
                                    Secure Banking Operations
                                </h3>

                                <p className="mt-1 text-sm text-blue-800">
                                    Financial transactions processed by cashiers
                                    are securely recorded and linked to blockchain.
                                </p>
                            </div>

                        </div>
                    </>
                )}
            </section>

        </main >
    )
}

export default CashierDashboard