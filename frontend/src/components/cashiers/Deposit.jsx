import React, { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'
import {
    FiArrowLeft,
    FiArrowDownLeft,
    FiUser,
    FiCreditCard,
    FiShield,
    FiCheckCircle,
    FiSearch,
    FiLoader,
    FiX
} from 'react-icons/fi'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const Deposit = () => {
    const { selectedCustomerAccount, setCashierPage, BACKEND_URL } = useContext(BankContext)
    const [accountNumber, setAccountNumber] = useState('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')

    const [customer, setCustomer] = useState(null)

    const [loadingCustomer, setLoadingCustomer] = useState(false)
    const [loadingDeposit, setLoadingDeposit] = useState(false)

    const [showReview, setShowReview] = useState(false)
    const [successData, setSuccessData] = useState(null)

    const [error, setError] = useState('')

    // Verify customer
    const handleVerifyCustomer = async () => {
        if (!accountNumber.trim()) {
            setError('Please enter customer account number')
            return
        }

        try {
            setLoadingCustomer(true)
            setError('')
            setCustomer(null)

            const response = await axios.get(
                `${BACKEND_URL}/api/cashier/verify-customer?accountNumber=${encodeURIComponent(
                    accountNumber.trim()
                )}`,
                {
                    withCredentials: true
                }
            )

            setCustomer(response.data.customer)

        } catch (error) {
            console.error('Verify customer error:', error)

            setError(
                error.response?.data?.message ||
                'Customer account not found'
            )
        } finally {
            setLoadingCustomer(false)
        }
    }


    // Review deposit
    const handleReviewDeposit = (e) => {
        e.preventDefault()

        const depositAmount = Number(amount)

        setError('')

        if (!customer) {
            setError('Please verify customer account first')
            return
        }

        if (!depositAmount || depositAmount <= 0) {
            setError('Please enter a valid deposit amount')
            return
        }

        if (Math.round(depositAmount * 100) !== depositAmount * 100) {
            setError('Amount can have maximum 2 decimal places')
            return
        }

        setShowReview(true)
    }


    // Confirm deposit
    const handleConfirmDeposit = async () => {
        try {
            setLoadingDeposit(true)
            setError('')

            const response = await axios.post(
                `${BACKEND_URL}/api/cashier/deposit`,
                {
                    accountNumber: customer.accountNumber,
                    amount: Number(amount),
                    description: description.trim()
                },
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)
                setShowReview(false)
                setSuccessData(response.data)
            }

        } catch (error) {
            console.error('Deposit error:', error)

            setError(
                error.response?.data?.message ||
                'Deposit failed. Please try again.'
            )

            toast.error(error.response?.data?.message ||
                'Deposit failed. Please try again.')
        } finally {
            setLoadingDeposit(false)
        }
    }

    const handleCloseSuccess = () => {
        setSuccessData(null)
        setAccountNumber('')
        setAmount('')
        setDescription('')
        setCustomer(null)
    }

    useEffect(() => {
        if (!selectedCustomerAccount) return

        setAccountNumber(selectedCustomerAccount)

        const verifyCustomer = async () => {
            try {
                setLoadingCustomer(true)
                setError('')

                const response = await axios.get(
                    `${BACKEND_URL}/api/cashier/verify-customer?accountNumber=${encodeURIComponent(
                        selectedCustomerAccount
                    )}`,
                    {
                        withCredentials: true
                    }
                )

                setCustomer(response.data.customer)

            } catch (error) {
                console.error('Verify customer error:', error)

                toast.error(
                    error.response?.data?.message ||
                    'Customer not found'
                )

                setError(
                    error.response?.data?.message ||
                    'Customer not found'
                )
            } finally {
                setLoadingCustomer(false)
            }
        }

        verifyCustomer()
    }, [selectedCustomerAccount])

    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}
            <header className="hidden h-20 items-center border-b border-slate-200 bg-white px-8 lg:flex">

                <button
                    onClick={() => setCashierPage("Cashier Dashboard")}
                    className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                >
                    <FiArrowLeft size={19} />
                </button>

                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        Deposit Money
                    </h1>

                    <p className="text-sm text-slate-500">
                        Deposit funds into a customer account
                    </p>
                </div>

            </header>


            <section className="mx-auto max-w-5xl p-6 lg:p-8">

                {/* Page Heading */}
                <div className="mb-8">

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <FiArrowDownLeft size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Customer Deposit
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Add funds securely to a customer account
                            </p>
                        </div>
                    </div>

                </div>


                {/* Error */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                        <FiX
                            className="mt-0.5 shrink-0 text-red-500"
                            size={18}
                        />

                        <p className="text-sm font-medium text-red-700">
                            {error}
                        </p>

                    </div>
                )}


                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Main Form */}
                    <div className="lg:col-span-2">

                        <form
                            onSubmit={handleReviewDeposit}
                            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                        >

                            {/* Account Number */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Customer Account Number
                                </label>

                                <div className="flex gap-2">

                                    <div className="relative flex-1">
                                        <FiCreditCard
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            size={18}
                                        />

                                        <input
                                            type="text"
                                            value={accountNumber}
                                            onChange={(e) => {
                                                setAccountNumber(e.target.value)
                                                setCustomer(null)
                                                setError('')
                                            }}
                                            placeholder="Enter account number"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleVerifyCustomer}
                                        disabled={
                                            loadingCustomer ||
                                            !accountNumber.trim()
                                        }
                                        className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loadingCustomer ? (
                                            <>
                                                <FiLoader
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                                Verifying
                                            </>
                                        ) : (
                                            <>
                                                <FiSearch size={17} />
                                                Verify
                                            </>
                                        )}
                                    </button>

                                </div>

                            </div>


                            {/* Customer Details */}
                            {customer && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">

                                    <div className="mb-4 flex items-center justify-between">

                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                                                <FiUser size={20} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Customer Verified
                                                </p>

                                                <p className="text-xs text-emerald-700">
                                                    Account successfully verified
                                                </p>
                                            </div>
                                        </div>

                                        <FiCheckCircle
                                            className="text-emerald-600"
                                            size={23}
                                        />

                                    </div>


                                    <div className="grid gap-4 sm:grid-cols-2">

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Full Name
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {customer.fullName}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Account Number
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {customer.accountNumber}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Account Type
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {customer.accountType}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Current Balance
                                            </p>

                                            <p className="mt-1 text-sm font-bold text-slate-900">
                                                ₹{Number(customer.balance || 0).toLocaleString('en-IN', {
                                                    minimumFractionDigits: 2
                                                })}
                                            </p>
                                        </div>

                                    </div>

                                </div>
                            )}


                            {/* Deposit Amount */}
                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Deposit Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400">
                                        ₹
                                    </span>

                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value)
                                            setError('')
                                        }}
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 text-xl font-semibold text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Maximum 2 decimal places allowed
                                </p>

                            </div>


                            {/* Description */}
                            <div className="mt-6">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                    <span className="ml-1 font-normal text-slate-400">
                                        (Optional)
                                    </span>
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Add a note for this deposit..."
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />

                            </div>


                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={
                                    !customer ||
                                    !amount ||
                                    Number(amount) <= 0
                                }
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FiArrowDownLeft size={18} />
                                Review Deposit
                            </button>

                        </form>

                    </div>


                    {/* Side Information */}
                    <div className="space-y-5">

                        {/* Security Card */}
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                                <FiShield size={21} />
                            </div>

                            <h3 className="mt-4 font-bold text-blue-950">
                                Secure Transaction
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-blue-800">
                                Every deposit is verified before processing
                                and recorded securely in the banking system.
                            </p>

                        </div>


                        {/* Process Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                            <h3 className="font-bold text-slate-900">
                                Deposit Process
                            </h3>

                            <div className="mt-5 space-y-4">

                                <div className="flex gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        1
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Verify Customer
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Enter the account number
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        2
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Enter Amount
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Specify the deposit amount
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                                        3
                                    </span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            Review & Confirm
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Verify details before processing
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* Review Modal */}
            {showReview && customer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Review Deposit
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Please verify the transaction details
                                </p>
                            </div>

                            <button
                                onClick={() => setShowReview(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <FiX size={19} />
                            </button>
                        </div>


                        <div className="mt-6 rounded-xl bg-slate-50 p-4">

                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                                    <FiUser size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {customer.fullName}
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        {customer.accountNumber}
                                    </p>
                                </div>
                            </div>

                        </div>


                        <div className="mt-5 space-y-3">

                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">
                                    Deposit Amount
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    ₹{Number(amount).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-slate-200 pt-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    New Balance
                                </span>

                                <span className="text-base font-bold text-emerald-600">
                                    ₹{(
                                        Number(customer.balance || 0) +
                                        Number(amount)
                                    ).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2
                                    })}
                                </span>
                            </div>

                        </div>


                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => setShowReview(false)}
                                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Go Back
                            </button>

                            <button
                                onClick={handleConfirmDeposit}
                                disabled={loadingDeposit}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loadingDeposit ? (
                                    <>
                                        <FiLoader
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle size={17} />
                                        Confirm
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {/* Success Modal */}
            {successData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <FiCheckCircle size={34} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Deposit Successful
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            ₹{Number(amount).toLocaleString('en-IN', {
                                minimumFractionDigits: 2
                            })}{' '}
                            has been successfully deposited into the customer's account.
                        </p>


                        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left">

                            <div className="flex justify-between py-2">
                                <span className="text-xs text-slate-500">
                                    Customer
                                </span>

                                <span className="text-xs font-semibold text-slate-900">
                                    {customer?.fullName}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-slate-200 py-2">
                                <span className="text-xs text-slate-500">
                                    Transaction ID
                                </span>

                                <span className="max-w-[180px] truncate text-xs font-semibold text-slate-900">
                                    {successData.transaction?.transactionId ||
                                        successData.transactionId ||
                                        'Completed'}
                                </span>
                            </div>

                            <div className="flex justify-between border-t border-slate-200 py-2">
                                <span className="text-xs text-slate-500">
                                    Status
                                </span>

                                <span className="text-xs font-bold text-emerald-600">
                                    Completed
                                </span>
                            </div>

                        </div>


                        <button
                            onClick={handleCloseSuccess}
                            className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                        >
                            Done
                        </button>

                    </div>

                </div>
            )}

        </main>
    )
}

export default Deposit