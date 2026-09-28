import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCreditCard,
    FiArrowLeft,
    FiUserPlus
} from 'react-icons/fi'

import axios from 'axios'
import BankContext from '../../context/BankContext'

const CreateCustomer = () => {
    const { setCashierPage, BACKEND_URL } = useContext(BankContext);

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        accountType: 'Savings',
        documentType: 'Aadhaar',
        documentNumber: ''
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await axios.post(
                `${BACKEND_URL}/api/cashier/customers`,
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,

                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: 'India'
                    },

                    accountType: formData.accountType,
                    currency: 'INR',

                    // KYC
                    documentType: formData.documentType,
                    documentNumber: formData.documentNumber
                },
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)

                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    accountType: 'Savings',
                    documentType: 'Aadhaar',
                    documentNumber: ''
                });

                setCashierPage("Cashier Dashboard");
            }

        } catch (error) {
            console.error('Create customer error:', error)

            toast.error(
                error.response?.data?.message ||
                'Failed to create customer'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            <header className="hidden h-20 items-center border-b border-slate-200 bg-white px-8 lg:flex">

                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Create Customer
                    </h2>

                    <p className="text-sm text-slate-500">
                        Register a new BlockBank customer
                    </p>
                </div>

            </header>

            <section className="p-6 lg:p-8">

                <div
                    onClick={() => setCashierPage("Cashier Dashboard")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
                >
                    <FiArrowLeft />
                    Back to Dashboard
                </div>

                <div className="mx-auto max-w-4xl">

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Create Customer Account
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Register a new customer and create their bank account.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
                    >

                        {/* Personal */}
                        <div className="mb-8">

                            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <FiUser className="text-blue-600" />
                                Personal Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>

                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter full name"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email
                                    </label>

                                    <div className="relative">

                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="customer@email.com"
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone
                                    </label>

                                    <div className="relative">

                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Date of Birth
                                    </label>

                                    <input
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        type="date"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Address */}
                        <div className="mb-8 border-t border-slate-200 pt-8">

                            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <FiMapPin className="text-blue-600" />
                                Address
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Street Address
                                    </label>

                                    <input
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter street address"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />

                                </div>

                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                                <input
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="Pincode"
                                    required
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                            </div>

                        </div>

                        {/* Account */}
                        <div className="mb-8 border-t border-slate-200 pt-8">

                            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <FiCreditCard className="text-blue-600" />
                                Account & KYC
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Account Type
                                    </label>

                                    <select
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="Savings">
                                            Savings
                                        </option>

                                        <option value="Current">
                                            Current
                                        </option>
                                    </select>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        KYC Document
                                    </label>

                                    <select
                                        name="documentType"
                                        value={formData.documentType}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="Aadhaar">
                                            Aadhaar
                                        </option>

                                        <option value="PAN">
                                            PAN
                                        </option>

                                        <option value="Passport">
                                            Passport
                                        </option>

                                        <option value="Driving License">
                                            Driving License
                                        </option>
                                    </select>

                                </div>

                                <div className="md:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Document Number
                                    </label>

                                    <input
                                        name="documentNumber"
                                        value={formData.documentNumber}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="Enter document number"
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex justify-end">

                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg transition ${loading
                                    ? 'cursor-not-allowed bg-blue-400'
                                    : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>

                                        Creating Customer...
                                    </>
                                ) : (
                                    <>
                                        <FiUserPlus />
                                        Create Customer
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    )
}

export default CreateCustomer