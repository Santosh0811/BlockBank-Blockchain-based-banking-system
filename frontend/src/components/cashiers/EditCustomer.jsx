import React, { useEffect, useState, useContext } from 'react'
import toast from 'react-hot-toast'
import {
    FiArrowLeft,
    FiUser,
    FiMail,
    FiPhone,
    FiCalendar,
    FiMapPin,
    FiCreditCard,
    FiShield,
    FiLoader,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const EditCustomer = () => {
    const { selectedCustomerAccount, setCashierPage, setSelectedCustomerAccount, BACKEND_URL } = useContext(BankContext)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showErrorPopup, setShowErrorPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        accountType: 'Savings',
        accountStatus: 'Active',

        // KYC
        kycStatus: 'Pending',
        documentType: 'Aadhaar',
        documentNumber: ''
    })

    const clearForm = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            accountType: 'Savings',
            accountStatus: 'Active',

            // KYC
            kycStatus: 'Pending',
            documentType: 'Aadhaar',
            documentNumber: ''
        })
        setSelectedCustomerAccount("");
    }

    // Get customer
    useEffect(() => {
        if (!selectedCustomerAccount) {
            setErrorMessage('Customer account number is missing')
            setLoading(false)
            return
        }

        const getCustomer = async () => {
            try {
                setLoading(true)
                setErrorMessage('')

                const response = await axios.get(
                    `${BACKEND_URL}/api/cashier/customer/${encodeURIComponent(
                        selectedCustomerAccount
                    )}`,
                    {
                        withCredentials: true
                    }
                )

                const customer = response.data.customer

                setFormData({
                    fullName: customer.fullName || '',
                    email: customer.email || '',
                    phone: customer.phone || '',
                    dateOfBirth: customer.dateOfBirth
                        ? customer.dateOfBirth.split('T')[0]
                        : '',

                    street: customer.address?.street || '',
                    city: customer.address?.city || '',
                    state: customer.address?.state || '',
                    pincode: customer.address?.pincode || '',
                    country: customer.address?.country || 'India',

                    accountType: customer.accountType || 'Savings',
                    accountStatus: customer.accountStatus || 'Active',

                    // KYC
                    kycStatus: customer.kyc?.status || 'Pending',
                    documentType: customer.kyc?.documentType || 'Aadhaar',
                    documentNumber: customer.kyc?.documentNumber || ''
                })

            } catch (error) {
                console.error('Get customer error:', error)

                toast.error(
                    error.response?.data?.message ||
                    'Failed to load customer'
                )

                setErrorMessage(
                    error.response?.data?.message ||
                    'Failed to load customer'
                )
            } finally {
                setLoading(false)
            }
        }

        getCustomer()
    }, [selectedCustomerAccount])


    // Handle input
    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }))

        setErrorMessage('')
    }


    // Submit
    const handleSave = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await axios.put(
                `${BACKEND_URL}/api/cashier/customer/${selectedCustomerAccount}`,
                {
                    // Personal information
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    dateOfBirth: formData.dateOfBirth,

                    // Address
                    address: {
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: formData.country
                    },

                    // Bank account
                    accountType: formData.accountType,

                    // Account status
                    accountStatus: formData.accountStatus,

                    // KYC
                    kycStatus: formData.kycStatus,
                    documentType: formData.documentType,
                    documentNumber: formData.documentNumber
                },
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)
                setShowSuccessPopup(true)
            }

        } catch (error) {
            console.error(
                'Update customer error:',
                error
            )

            toast.error(error.response?.data?.message ||
                'Failed to update customer details')

            setErrorMessage(
                error.response?.data?.message ||
                'Failed to update customer details'
            )

            setShowErrorPopup(true)

        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        <FiLoader
                            size={32}
                            className="mx-auto animate-spin text-blue-600"
                        />

                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Loading customer details...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}
            <header className="hidden h-20 items-center border-b border-slate-200 bg-white px-8 lg:flex">

                <button
                    onClick={() => {
                        setCashierPage("Cashier Dashboard");
                        clearForm();
                    }}
                    className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                >
                    <FiArrowLeft size={19} />
                </button>

                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        Edit Customer
                    </h1>

                    <p className="text-sm text-slate-500">
                        Update customer account information
                    </p>
                </div>

            </header>


            <section className="mx-auto max-w-5xl p-6 lg:p-8">

                {/* Heading */}
                <div className="mb-7">

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <FiUser size={24} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Customer Information
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Update personal, contact, address and KYC details
                            </p>
                        </div>

                    </div>

                </div>

                <form onSubmit={handleSave}>

                    {/* Personal Information */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <FiUser size={19} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Personal Information
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Customer identity and contact details
                                </p>
                            </div>

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Full Name */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <FiUser
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={17}
                                    />

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>


                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <FiMail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={17}
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>


                            {/* Phone */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <FiPhone
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={17}
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>


                            {/* DOB */}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Date of Birth
                                </label>

                                <div className="relative">
                                    <FiCalendar
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={17}
                                    />

                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>


                    {/* Address */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                <FiMapPin size={19} />
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900">
                                    Address
                                </h3>

                                <p className="text-xs text-slate-500">
                                    Customer residential address
                                </p>
                            </div>

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">

                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Street Address
                                </label>

                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    City
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    State
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                            </div>


                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Country
                                </label>

                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                                />
                            </div>

                        </div>

                    </div>


                    {/* Account + KYC */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">

                        {/* Account */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <FiCreditCard size={19} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Account Details
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        Banking account settings
                                    </p>
                                </div>

                            </div>


                            <div className="space-y-5">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Account Number
                                    </label>

                                    <input
                                        type="text"
                                        value={selectedCustomerAccount || ''}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
                                    />
                                </div>


                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Account Type
                                    </label>

                                    <select
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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
                                        Account Status
                                    </label>

                                    <select
                                        name="accountStatus"
                                        value={formData.accountStatus}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>

                                        <option value="Frozen">
                                            Frozen
                                        </option>

                                        <option value="Blocked">
                                            Blocked
                                        </option>
                                    </select>
                                </div>

                            </div>

                        </div>


                        {/* KYC */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FiShield className="text-purple-600" size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        KYC Information
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Update customer verification details
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">

                                {/* KYC Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        KYC Status
                                    </label>

                                    <select
                                        value={formData.kycStatus}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                kycStatus: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Verified">Verified</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                </div>

                                {/* Document Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Type
                                    </label>

                                    <select
                                        value={formData.documentType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                documentType: e.target.value
                                            })
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Aadhaar">Aadhaar</option>
                                        <option value="PAN">PAN</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Driving License">
                                            Driving License
                                        </option>
                                    </select>
                                </div>

                                {/* Document Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Document Number
                                    </label>

                                    <input
                                        type="text"
                                        value={formData.documentNumber}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                documentNumber: e.target.value
                                            })
                                        }
                                        placeholder="Enter document number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                            </div>
                        </div>

                    </div>


                    {/* Security Notice */}
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <FiShield size={19} />
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-blue-950">
                                Customer Data Protection
                            </h3>

                            <p className="mt-1 text-xs leading-5 text-blue-800">
                                Changes to customer information are recorded
                                securely. Account number, balance and transaction
                                history cannot be modified from this page.
                            </p>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => {
                                setCashierPage("Cashier Dashboard");
                                clearForm();
                            }}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>

                    </div>

                </form>

            </section>

            {showSuccessPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">

                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                            <FiCheckCircle
                                size={34}
                                className="text-green-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Customer Updated
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Customer details have been updated successfully.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowSuccessPopup(false)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
                        >
                            Continue
                        </button>

                    </div>
                </div>
            )}

            {showErrorPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">

                        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
                            <FiXCircle
                                size={34}
                                className="text-red-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Update Failed
                        </h2>

                        <p className="text-gray-500 mb-6">
                            {errorMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowErrorPopup(false)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition"
                        >
                            Try Again
                        </button>

                    </div>
                </div>
            )}
        </main>
    )
}

export default EditCustomer