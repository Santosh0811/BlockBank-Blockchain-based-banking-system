import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    FiSearch,
    FiUsers,
    FiUser,
    FiCreditCard,
    FiPhone,
    FiArrowDownLeft,
    FiArrowUpRight,
    FiEye,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiChevronLeft,
    FiX,
    FiMapPin,
    FiShield,
    FiActivity,
    FiEdit2
} from 'react-icons/fi'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const Customers = () => {
    const { setCashierPage, setSelectedCustomerAccount, BACKEND_URL } = useContext(BankContext);
    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedCustomer, setSelectedCustomer] = useState(null)

    // Get customers
    const getCustomers = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/cashier/customers`,
                {
                    withCredentials: true
                }
            )

            setCustomers(response.data.customers || [])

        } catch (error) {
            console.error('Get customers error:', error)

            toast.error(
                error.response?.data?.message ||
                'Failed to load customers'
            )

            setError(
                error.response?.data?.message ||
                'Failed to load customers'
            )
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        getCustomers()
    }, [])


    // Search
    const filteredCustomers = customers.filter((customer) => {
        const value = search.toLowerCase().trim()

        if (!value) return true

        return (
            customer.fullName?.toLowerCase().includes(value) ||
            customer.accountNumber?.toLowerCase().includes(value) ||
            customer.phone?.toLowerCase().includes(value)
        )
    })


    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2
        })}`
    }


    const getStatusStyle = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'

            case 'Frozen':
                return 'bg-amber-50 text-amber-700 border-amber-200'

            case 'Blocked':
                return 'bg-red-50 text-red-700 border-red-200'

            default:
                return 'bg-slate-50 text-slate-600 border-slate-200'
        }
    }


    const getKycStyle = (status) => {
        switch (status) {
            case 'Verified':
                return 'text-emerald-600'

            case 'Rejected':
                return 'text-red-600'

            default:
                return 'text-amber-600'
        }
    }


    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}
            <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => setCashierPage("Cashier Dashboard")}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    >
                        <FiChevronLeft size={19} />
                    </button>

                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            Customers
                        </h1>

                        <p className="text-sm text-slate-500">
                            Manage registered customer accounts
                        </p>
                    </div>

                </div>

                <button
                    onClick={getCustomers}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                    <FiRefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />

                    Refresh
                </button>

            </header>


            <section className="p-6 lg:p-8">

                {/* Page Heading */}
                <div className="mb-7">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <FiUsers size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Customer Accounts
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Search and manage customer banking accounts
                            </p>
                        </div>

                    </div>

                </div>


                {/* Summary */}
                <div className="mb-6 grid gap-4 grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Customers
                                </p>

                                <p className="mt-2 text-lg lg:text-xl font-bold text-slate-900">
                                    {customers.length}
                                </p>
                            </div>

                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FiUsers />
                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Active Accounts
                                </p>

                                <p className="mt-2 text-lg lg:text-xl font-bold text-slate-900">
                                    {
                                        customers.filter(
                                            (customer) =>
                                                customer.accountStatus === 'Active'
                                        ).length
                                    }
                                </p>
                            </div>

                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <FiCheckCircle />
                            </div>

                        </div>

                    </div>


                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Search Results
                                </p>

                                <p className="mt-2 text-lg lg:text-xl font-bold text-slate-900">
                                    {filteredCustomers.length}
                                </p>
                            </div>

                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FiSearch />
                            </div>

                        </div>

                    </div>

                </div>


                {/* Search */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="relative">

                        <FiSearch
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, account number or phone..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                        />

                    </div>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}


                {/* Loading */}
                {loading ? (

                    <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">

                        <div className="text-center">

                            <FiRefreshCw
                                size={30}
                                className="mx-auto animate-spin text-blue-600"
                            />

                            <p className="mt-4 text-sm font-medium text-slate-500">
                                Loading customers...
                            </p>

                        </div>

                    </div>

                ) : filteredCustomers.length === 0 ? (

                    /* Empty */
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <FiUsers size={25} />
                        </div>

                        <h3 className="mt-4 font-bold text-slate-900">
                            No customers found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Try searching with a different name, account
                            number or phone number.
                        </p>

                    </div>

                ) : (

                    /* Customer Table */
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[950px]">

                                <thead className="border-b border-slate-200 bg-slate-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Customer
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Account
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Type
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Balance
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            KYC
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y divide-slate-100">

                                    {filteredCustomers.map((customer) => (

                                        <tr
                                            key={customer._id}
                                            className="transition hover:bg-slate-50"
                                        >

                                            {/* Customer */}
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-600">
                                                        {customer.fullName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {customer.fullName}
                                                        </p>

                                                        <div className="mt-0.5 flex items-center gap-1.5">

                                                            <FiPhone
                                                                size={11}
                                                                className="text-slate-400"
                                                            />

                                                            <p className="text-xs text-slate-500">
                                                                {customer.phone}
                                                            </p>

                                                        </div>
                                                    </div>

                                                </div>

                                            </td>


                                            {/* Account */}
                                            <td className="px-6 py-4">

                                                <div className="flex items-center gap-2">

                                                    <FiCreditCard
                                                        size={16}
                                                        className="text-slate-400"
                                                    />

                                                    <span className="text-sm font-semibold text-slate-700">
                                                        {customer.accountNumber}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* Account Type */}
                                            <td className="px-6 py-4">

                                                <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                                    {customer.accountType}
                                                </span>

                                            </td>


                                            {/* Balance */}
                                            <td className="px-6 py-4">

                                                <p className="text-sm font-bold text-slate-900">
                                                    {formatCurrency(customer.balance)}
                                                </p>

                                            </td>


                                            {/* KYC */}
                                            <td className="px-6 py-4">

                                                <div className={`flex items-center gap-1.5 text-xs font-semibold ${getKycStyle(
                                                    customer.kyc?.status
                                                )}`}>

                                                    {customer.kyc?.status === 'Verified' ? (
                                                        <FiCheckCircle size={14} />
                                                    ) : customer.kyc?.status === 'Rejected' ? (
                                                        <FiXCircle size={14} />
                                                    ) : (
                                                        <FiClock size={14} />
                                                    )}

                                                    {customer.kyc?.status || 'Pending'}

                                                </div>

                                            </td>


                                            {/* Status */}
                                            <td className="px-6 py-4">

                                                <span
                                                    className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusStyle(
                                                        customer.accountStatus
                                                    )}`}
                                                >
                                                    {customer.accountStatus}
                                                </span>

                                            </td>


                                            {/* Action */}
                                            <td className="px-6 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            setSelectedCustomer(
                                                                customer
                                                            )
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                                        title="View customer"
                                                    >
                                                        <FiEye size={16} />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomerAccount(
                                                                customer.accountNumber
                                                            )

                                                            setSelectedCustomer(null)

                                                            setCashierPage("Deposit")
                                                        }
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                                                        title="Deposit"
                                                    >
                                                        <FiArrowDownLeft
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomerAccount(
                                                                customer.accountNumber
                                                            )

                                                            setSelectedCustomer(null)

                                                            setCashierPage("Withdrawal")
                                                        }
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                                                        title="Withdrawal"
                                                    >
                                                        <FiArrowUpRight
                                                            size={16}
                                                        />
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            setSelectedCustomerAccount(
                                                                customer.accountNumber
                                                            )

                                                            setSelectedCustomer(null)

                                                            setCashierPage("Edit Customer")
                                                        }}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                                                        title="Edit customer"
                                                    >
                                                        <FiEdit2 size={16} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                )}


                {/* Customer Details Modal */}
                {selectedCustomer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
                                        {selectedCustomer.fullName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            {selectedCustomer.fullName}
                                        </h2>

                                        <p className="mt-0.5 text-sm text-slate-500">
                                            Customer Profile
                                        </p>
                                    </div>

                                </div>

                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <FiX size={20} />
                                </button>

                            </div>


                            <div className="p-6">

                                {/* Account Summary */}
                                <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">

                                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                                                Account Number
                                            </p>

                                            <p className="mt-1 text-xl font-bold tracking-wide text-slate-900">
                                                {selectedCustomer.accountNumber}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {selectedCustomer.accountType} Account
                                            </p>
                                        </div>


                                        <div className="sm:text-right">

                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                Available Balance
                                            </p>

                                            <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                                ₹{Number(
                                                    selectedCustomer.balance || 0
                                                ).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2
                                                })}
                                            </p>

                                            <span
                                                className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-bold ${selectedCustomer.accountStatus === 'Active'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-red-200 bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {selectedCustomer.accountStatus}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* Personal Information */}
                                <div className="mt-6">

                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                            <FiUser size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Personal Information
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Customer identity and contact information
                                            </p>
                                        </div>

                                    </div>


                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                        {/* Full Name */}
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Full Name
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.fullName || '—'}
                                            </p>
                                        </div>


                                        {/* Email */}
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Email Address
                                            </p>

                                            <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                                                {selectedCustomer.email || '—'}
                                            </p>
                                        </div>


                                        {/* Phone */}
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Phone Number
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.phone || '—'}
                                            </p>
                                        </div>


                                        {/* DOB */}
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Date of Birth
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.dateOfBirth
                                                    ? new Date(
                                                        selectedCustomer.dateOfBirth
                                                    ).toLocaleDateString('en-IN')
                                                    : '—'}
                                            </p>
                                        </div>


                                        {/* Currency */}
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Currency
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.currency || 'INR'}
                                            </p>
                                        </div>


                                        {/* Email Verification */}
                                        <div className="rounded-xl border border-slate-200 p-4">

                                            <p className="text-xs text-slate-400">
                                                Email Verification
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                {selectedCustomer.isEmailVerified ? (
                                                    <>
                                                        <FiCheckCircle
                                                            className="text-emerald-600"
                                                            size={15}
                                                        />

                                                        <span className="text-sm font-semibold text-emerald-600">
                                                            Verified
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiClock
                                                            className="text-amber-600"
                                                            size={15}
                                                        />

                                                        <span className="text-sm font-semibold text-amber-600">
                                                            Not Verified
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* Address */}
                                <div className="mt-7">

                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                            <FiMapPin size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Address
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Registered residential address
                                            </p>
                                        </div>

                                    </div>


                                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

                                        <p className="text-sm font-semibold leading-6 text-slate-800">
                                            {selectedCustomer.address?.street || '—'}
                                            {selectedCustomer.address?.city &&
                                                `, ${selectedCustomer.address.city}`}
                                            {selectedCustomer.address?.state &&
                                                `, ${selectedCustomer.address.state}`}
                                            {selectedCustomer.address?.pincode &&
                                                ` - ${selectedCustomer.address.pincode}`}
                                            {selectedCustomer.address?.country &&
                                                `, ${selectedCustomer.address.country}`}
                                        </p>

                                    </div>

                                </div>


                                {/* Account Details */}
                                <div className="mt-7">

                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                            <FiCreditCard size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Account Details
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Banking account information
                                            </p>
                                        </div>

                                    </div>


                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Account Number
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                {selectedCustomer.accountNumber}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Account Type
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                {selectedCustomer.accountType}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Currency
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                {selectedCustomer.currency || 'INR'}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Current Balance
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-emerald-600">
                                                ₹{Number(
                                                    selectedCustomer.balance || 0
                                                ).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2
                                                })}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Account Status
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                {selectedCustomer.accountStatus}
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Wallet Address
                                            </p>

                                            <p className="mt-1 break-all font-mono text-xs font-semibold text-slate-700">
                                                {selectedCustomer.walletAddress || 'Not linked'}
                                            </p>
                                        </div>

                                    </div>

                                </div>


                                {/* KYC */}
                                <div className="mt-7">

                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                            <FiShield size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                KYC Information
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Customer identity verification details
                                            </p>
                                        </div>

                                    </div>


                                    <div className="grid gap-4 sm:grid-cols-3">

                                        <div className="rounded-xl border border-slate-200 p-4">

                                            <p className="text-xs text-slate-400">
                                                KYC Status
                                            </p>

                                            <div className="mt-1 flex items-center gap-2">

                                                {selectedCustomer.kyc?.status === 'Verified' ? (
                                                    <FiCheckCircle
                                                        className="text-emerald-600"
                                                        size={15}
                                                    />
                                                ) : selectedCustomer.kyc?.status === 'Rejected' ? (
                                                    <FiXCircle
                                                        className="text-red-600"
                                                        size={15}
                                                    />
                                                ) : (
                                                    <FiClock
                                                        className="text-amber-600"
                                                        size={15}
                                                    />
                                                )}

                                                <span className="text-sm font-semibold text-slate-800">
                                                    {selectedCustomer.kyc?.status || 'Pending'}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="rounded-xl border border-slate-200 p-4">

                                            <p className="text-xs text-slate-400">
                                                Document Type
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.kyc?.documentType || '—'}
                                            </p>

                                        </div>


                                        <div className="rounded-xl border border-slate-200 p-4">

                                            <p className="text-xs text-slate-400">
                                                Document Number
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.kyc?.documentNumber || '—'}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Account Timeline */}
                                <div className="mt-7">

                                    <div className="mb-4 flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <FiActivity size={19} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Account Activity
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                Account creation and login information
                                            </p>
                                        </div>

                                    </div>


                                    <div className="grid gap-4 sm:grid-cols-3">

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Account Created
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.createdAt
                                                    ? new Date(
                                                        selectedCustomer.createdAt
                                                    ).toLocaleString('en-IN')
                                                    : '—'}
                                            </p>
                                        </div>


                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Last Updated
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.updatedAt
                                                    ? new Date(
                                                        selectedCustomer.updatedAt
                                                    ).toLocaleString('en-IN')
                                                    : '—'}
                                            </p>
                                        </div>


                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="text-xs text-slate-400">
                                                Last Login
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {selectedCustomer.lastLogin
                                                    ? new Date(
                                                        selectedCustomer.lastLogin
                                                    ).toLocaleString('en-IN')
                                                    : 'Never'}
                                            </p>
                                        </div>

                                    </div>

                                </div>


                                {/* Actions */}
                                <div className="mt-7 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

                                    <button
                                        onClick={() => {
                                            setSelectedCustomerAccount(selectedCustomer.accountNumber)
                                            setSelectedCustomer(null)
                                            setCashierPage("Deposit")
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                                    >
                                        <FiArrowDownLeft size={17} />
                                        Deposit
                                    </button>


                                    <button
                                        onClick={() => {
                                            setSelectedCustomerAccount(selectedCustomer.accountNumber)
                                            setSelectedCustomer(null)
                                            setCashierPage("Withdrawal")
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                                    >
                                        <FiArrowUpRight size={17} />
                                        Withdrawal
                                    </button>


                                    <button
                                        onClick={() => {
                                            setSelectedCustomerAccount(selectedCustomer.accountNumber)
                                            setSelectedCustomer(null)
                                            setCashierPage("Edit Customer")
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        <FiEdit2 size={17} />
                                        Edit Customer
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </section>

        </main>
    )
}

export default Customers