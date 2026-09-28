import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
    LuUser,
    LuMail,
    LuPhone,
    LuMapPin,
    LuCalendar,
    LuShieldCheck,
    LuWalletCards,
    LuLock,
    LuCheck,
    LuIndianRupee,
} from 'react-icons/lu'
import BankContext from '../../context/BankContext'

const Profile = () => {
    const { BACKEND_URL } = useContext(BankContext);
    // ================= PROFILE STATE =================

    const [customer, setCustomer] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // ================= PASSWORD STATE =================

    const [showPasswordForm, setShowPasswordForm] = useState(false)

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [passwordLoading, setPasswordLoading] = useState(false)

    // ================= GET PROFILE =================

    useEffect(() => {
        const getProfile = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await axios.get(
                    `${BACKEND_URL}/api/customer/profile`,
                    {
                        withCredentials: true,
                    }
                )

                setCustomer(response.data.customer)
            } catch (error) {
                console.error('Profile error:', error)

                toast.error(error.response?.data?.message ||
                    'Failed to load profile')

                setError(
                    error.response?.data?.message ||
                    'Failed to load profile'
                )
            } finally {
                setLoading(false)
            }
        }

        getProfile()
    }, [])

    // ================= PASSWORD INPUT =================

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        })
    }

    // ================= CHANGE PASSWORD =================

    const handleChangePassword = async (e) => {
        e.preventDefault()

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = passwordData

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast('Please fill all password fields')
            return
        }

        if (newPassword.length < 6) {
            toast('New password must be at least 6 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            toast('New passwords do not match')
            return
        }

        if (currentPassword === newPassword) {
            toast('New password must be different from current password')
            return
        }

        try {
            setPasswordLoading(true)

            const response = await axios.put(
                `${BACKEND_URL}/api/customer/change-password`,
                {
                    currentPassword,
                    newPassword,
                },
                {
                    withCredentials: true,
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message);

                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })

                setShowPasswordForm(false)
            }
        } catch (error) {
            console.error('Change password error:', error)

            toast.error(
                error.response?.data?.message ||
                'Failed to change password'
            )
        } finally {
            setPasswordLoading(false)
        }
    }

    // ================= LOADING =================

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 lg:ml-[20vw]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

                    <p className="text-sm text-gray-500">
                        Loading profile...
                    </p>
                </div>
            </main>
        )
    }

    // ================= ERROR =================

    if (error || !customer) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50 lg:ml-[20vw]">
                <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <p className="font-semibold text-red-600">
                        {error || 'Unable to load profile'}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        )
    }

    // ================= FORMATTED DATA =================

    const formattedDOB = customer.dateOfBirth
        ? new Date(customer.dateOfBirth).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }
        )
        : 'Not provided'

    const formattedCreatedDate = customer.createdAt
        ? new Date(customer.createdAt).toLocaleDateString(
            'en-IN',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }
        )
        : 'Not available'

    const fullAddress = [
        customer.address?.street,
        customer.address?.city,
        customer.address?.state,
        customer.address?.pincode,
        customer.address?.country,
    ]
        .filter(Boolean)
        .join(', ')

    const kycStatus = customer.kyc?.status || 'Pending'

    return (
        <main className="min-h-screen bg-gray-50 lg:ml-[20vw]">

            {/* ===================================================== */}
            {/* TOP BAR */}
            {/* ===================================================== */}

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
                                setPage("Profile")
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


            {/* ===================================================== */}
            {/* PAGE CONTENT */}
            {/* ===================================================== */}

            <section className="p-5 sm:p-6 lg:p-8">

                {/* Heading */}

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            My Profile
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 sm:text-base">
                            View your personal and account information.
                        </p>

                    </div>

                </div>


                {/* ================================================= */}
                {/* PROFILE HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        mt-8
                        overflow-hidden
                        rounded-2xl
                        border border-gray-200
                        bg-white
                        shadow-sm
                    "
                >

                    {/* Blue Banner */}

                    <div className="h-20 lg:h-32 bg-gradient-to-r from-blue-700 to-blue-500"></div>


                    <div className="px-6 pb-6 relative">

                        <div className="-mt-8 lg:-mt-14 flex flex-row lg:items-start gap-4 items-end justify-between">

                            {/* Avatar + User */}

                            <div className="flex items-end gap-4">

                                <div
                                    className="
                                        flex h-18 lg:h-28 w-18 lg:w-28
                                        items-center justify-center
                                        rounded-full
                                        border-4
                                        border-white
                                        bg-blue-100
                                        text-blue-700
                                        shadow-md
                                    "
                                >
                                    <LuUser size={48} />
                                </div>


                                <div className="lg:pb-2">

                                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900">
                                        {customer.fullName}
                                    </h2>

                                    <p className="text-xs lg:text-sm text-gray-500">
                                        {customer.email}
                                    </p>

                                </div>

                            </div>
                        </div>
                        {/* Account Status */}

                        <div
                            className={`
                                    absolute
                                    lg:-top-14
                                    -top-10
                                    right-0
                                    lg:mr-4
                                    mr-2
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    lg:px-4 
                                    px-2 
                                    lg:py-2 
                                    py-1
                                    lg:text-sm
                                    text-[10px]
                                    font-semibold
                                    ${customer.accountStatus === 'Active'
                                    ? 'bg-green-100 text-green-700'
                                    : customer.accountStatus === 'Frozen'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                }
                                `}
                        >

                            <span
                                className={`
                                        h-2 w-2 rounded-full
                                        ${customer.accountStatus === 'Active'
                                        ? 'bg-green-500'
                                        : customer.accountStatus === 'Frozen'
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                    }
                                    `}
                            ></span>

                            Account {customer.accountStatus}

                        </div>
                    </div>

                </div>


                {/* ================================================= */}
                {/* CONTENT GRID */}
                {/* ================================================= */}

                <div className="mt-6 grid gap-6 xl:grid-cols-3">


                    {/* ================================================= */}
                    {/* PERSONAL INFORMATION */}
                    {/* ================================================= */}

                    <div
                        className="
                            xl:col-span-2
                            rounded-2xl
                            border border-gray-200
                            bg-white
                            p-6
                            shadow-sm
                        "
                    >

                        {/* Section Header */}

                        <div className="mb-6 flex items-center gap-3">

                            <div
                                className="
                                    flex h-11 w-11
                                    items-center justify-center
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                "
                            >
                                <LuUser size={22} />
                            </div>

                            <div>

                                <h2 className="font-bold text-gray-900">
                                    Personal Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Your personal details
                                </p>

                            </div>

                        </div>


                        <div className="grid gap-5 md:grid-cols-2">


                            {/* Full Name */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>

                                <div className="relative">

                                    <LuUser
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type="text"
                                        value={customer.fullName || ''}
                                        disabled
                                        readOnly
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            py-3
                                            pl-11 pr-4
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                </div>

                            </div>


                            {/* Email */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <LuMail
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type="email"
                                        value={customer.email || ''}
                                        disabled
                                        readOnly
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            py-3
                                            pl-11 pr-4
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                </div>

                            </div>


                            {/* Phone */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <LuPhone
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type="text"
                                        value={customer.phone || ''}
                                        disabled
                                        readOnly
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            py-3
                                            pl-11 pr-4
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                </div>

                            </div>


                            {/* Date of Birth */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Date of Birth
                                </label>

                                <div className="relative">

                                    <LuCalendar
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={19}
                                    />

                                    <input
                                        type="text"
                                        value={formattedDOB}
                                        disabled
                                        readOnly
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            py-3
                                            pl-11 pr-4
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                </div>

                            </div>


                            {/* Address */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Address
                                </label>

                                <div className="relative">

                                    <LuMapPin
                                        className="absolute left-4 top-4 text-gray-400"
                                        size={19}
                                    />

                                    <textarea
                                        rows="3"
                                        value={fullAddress || 'Address not provided'}
                                        disabled
                                        readOnly
                                        className="
                                            w-full
                                            resize-none
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            py-3
                                            pl-11 pr-4
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            disabled:cursor-not-allowed
                                        "
                                    />

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* ACCOUNTRMATION */}
                    {/* ================================================= */}

                    <div
                        className="
                            rounded-2xl
                            border border-gray-200
                            bg-white
                            p-6
                            shadow-sm
                        "
                    >

                        {/* Section Header */}

                        <div className="mb-6 flex items-center gap-3">

                            <div
                                className="
                                    flex h-11 w-11
                                    items-center justify-center
                                    rounded-xl
                                    bg-purple-100
                                    text-purple-600
                                "
                            >
                                <LuWalletCards size={22} />
                            </div>

                            <div>

                                <h2 className="font-bold text-gray-900">
                                    Accountrmation
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Banking details
                                </p>

                            </div>

                        </div>


                        <div className="space-y-5">


                            {/* Account Number */}

                            <div>

                                <p className="text-xs text-gray-500">
                                    Account Number
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    {customer.accountNumber || 'N/A'}
                                </p>

                            </div>


                            {/* Account Type */}

                            <div>

                                <p className="text-xs text-gray-500">
                                    Account Type
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    {customer.accountType || 'N/A'} Account
                                </p>

                            </div>


                            {/* Balance */}

                            <div>

                                <p className="text-xs text-gray-500">
                                    Available Balance
                                </p>

                                <p
                                    className="
                                        mt-1
                                        flex items-center gap-1
                                        text-xl
                                        font-bold
                                        text-gray-900
                                    "
                                >

                                    <LuIndianRupee
                                        size={19}
                                        strokeWidth={3}
                                    />

                                    {Number(
                                        customer.balance || 0
                                    ).toFixed(2)}

                                </p>

                            </div>


                            {/* Account Created */}

                            <div>

                                <p className="text-xs text-gray-500">
                                    Account Created
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">
                                    {formattedCreatedDate}
                                </p>

                            </div>


                            {/* KYC */}

                            <div
                                className={`
                                    flex items-center justify-between
                                    rounded-xl
                                    p-4
                                    ${kycStatus === 'Verified'
                                        ? 'bg-green-50'
                                        : kycStatus === 'Rejected'
                                            ? 'bg-red-50'
                                            : 'bg-yellow-50'
                                    }
                                `}
                            >

                                <div className="flex items-center gap-3">

                                    <LuShieldCheck
                                        className={
                                            kycStatus === 'Verified'
                                                ? 'text-green-600'
                                                : kycStatus === 'Rejected'
                                                    ? 'text-red-600'
                                                    : 'text-yellow-600'
                                        }
                                        size={22}
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-gray-800">
                                            KYC {kycStatus}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {customer.kyc?.documentType
                                                ? `${customer.kyc.documentType} submitted`
                                                : 'Identity document not provided'}
                                        </p>

                                    </div>

                                </div>


                                {kycStatus === 'Verified' && (
                                    <LuCheck
                                        className="text-green-600"
                                        size={20}
                                    />
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* SECURITY */}
                {/* ================================================= */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                    "
                >

                    {/* Security Header */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">

                            <div
                                className="
                                    flex h-12 w-12
                                    items-center justify-center
                                    rounded-xl
                                    bg-orange-100
                                    text-orange-600
                                "
                            >
                                <LuLock size={23} />
                            </div>

                            <div>

                                <h2 className="font-bold text-gray-900">
                                    Account Security
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Change your password to keep your account secure.
                                </p>

                            </div>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setShowPasswordForm(!showPasswordForm)
                            }
                            className="
                                flex items-center justify-center gap-2
                                rounded-lg
                                border border-gray-200
                                px-5 py-2.5
                                text-sm font-semibold
                                text-gray-700
                                transition
                                hover:border-blue-300
                                hover:bg-blue-50
                                hover:text-blue-600
                            "
                        >

                            <LuLock size={17} />

                            {showPasswordForm
                                ? 'Cancel'
                                : 'Change Password'}

                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* PASSWORD FORM */}
                    {/* ================================================= */}

                    {showPasswordForm && (

                        <form
                            onSubmit={handleChangePassword}
                            className="
                                mt-6
                                border-t
                                border-gray-100
                                pt-6
                            "
                        >

                            <div className="grid gap-5 md:grid-cols-3">


                                {/* Current Password */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={
                                            passwordData.currentPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Current password"
                                        autoComplete="current-password"
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            px-4 py-3
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                        "
                                    />

                                </div>


                                {/* New Password */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={
                                            passwordData.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="New password"
                                        autoComplete="new-password"
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            px-4 py-3
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                        "
                                    />

                                </div>


                                {/* Confirm Password */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={
                                            passwordData.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        className="
                                            w-full
                                            rounded-lg
                                            border border-gray-200
                                            bg-gray-50
                                            px-4 py-3
                                            text-sm
                                            text-gray-700
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                        "
                                    />

                                </div>


                                {/* Update Button */}

                                <div className="md:col-span-3">

                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="
                                            rounded-lg
                                            bg-blue-600
                                            px-6 py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-blue-700
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                        "
                                    >

                                        {passwordLoading
                                            ? 'Updating Password...'
                                            : 'Update Password'}

                                    </button>

                                </div>

                            </div>

                        </form>

                    )}

                </div>

            </section>

        </main>
    )
}

export default Profile