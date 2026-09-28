import React, { useContext, useState } from 'react'
import Block from '../../assets/Block.png'
import {
    FiArrowLeft,
    FiArrowRight,
    FiLock,
    FiEye,
    FiEyeOff,
    FiXCircle,
    FiCheckCircle
} from 'react-icons/fi'
import {
    Link,
    useLocation,
    useNavigate
} from 'react-router-dom'
import axios from 'axios'
import BankContext from '../../context/BankContext'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const { BACKEND_URL } = useContext(BankContext);

    const email = location.state?.email || ''

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false)

    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: '',
        message: ''
    })

    const handleResetPassword = async (e) => {
        e.preventDefault()

        if (!email) {
            setPopup({
                show: true,
                type: 'error',
                message:
                    'Email information is missing. Please start the password reset process again.'
            })
            return
        }

        if (!newPassword || !confirmPassword) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Please fill in both password fields.'
            })
            return
        }

        if (newPassword.length < 8) {
            setPopup({
                show: true,
                type: 'error',
                message:
                    'Password must be at least 8 characters long.'
            })
            return
        }

        if (newPassword !== confirmPassword) {
            setPopup({
                show: true,
                type: 'error',
                message:
                    'New password and confirm password do not match.'
            })
            return
        }

        try {
            setLoading(true)

            const response = await axios.post(
                `${BACKEND_URL}/api/auth/reset-password`,
                {
                    email,
                    newPassword
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message);
                
                setPopup({
                    show: true,
                    type: 'success',
                    message:
                        'Your password has been reset successfully. You can now login with your new password.'
                })

                setTimeout(() => {
                    setNewPassword("");
                    setConfirmPassword("");
                    navigate("/login");
                }, 1000)
            }
        } catch (error) {
            console.error(
                'Reset password error:',
                error
            )

            const message =
                error.response?.data?.message ||
                'Unable to reset password. Please try again.'

            toast.error(message);

            setPopup({
                show: true,
                type: 'error',
                message
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSuccessClose = () => {
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center px-4 py-4">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-2">
                    <Link
                        to="/home"
                        className="flex items-center gap-3"
                    >
                        <img
                            src={Block}
                            className="h-12 w-12 object-contain"
                            alt="BlockBank Logo"
                        />

                        <span className="text-3xl font-bold text-blue-950">
                            BlockBank
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-6">

                    <div className="text-center mb-8">

                        <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiLock
                                className="text-blue-600"
                                size={27}
                            />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Reset Password
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Create a new password for your account
                        </p>
                    </div>

                    {/* Email */}
                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-600">
                            Resetting password for
                        </p>

                        <p className="mt-1 text-sm font-semibold text-blue-600 break-all">
                            {email}
                        </p>
                    </div>

                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-5"
                    >

                        {/* New Password */}
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                New Password
                            </label>

                            <div className="relative">

                                <FiLock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={20}
                                />

                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-slate-50
                                        py-3.5
                                        pl-12
                                        pr-12
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/20
                                        focus:bg-white
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    {showPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>

                            </div>

                            <p className="mt-2 text-xs text-slate-500">
                                Password must contain at least 8 characters.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                Confirm Password
                            </label>

                            <div className="relative">

                                <FiLock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={20}
                                />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-slate-50
                                        py-3.5
                                        pl-12
                                        pr-12
                                        text-slate-800
                                        outline-none
                                        transition
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-500/20
                                        focus:bg-white
                                    "
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        hover:text-blue-600
                                        transition
                                    "
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff size={20} />
                                    ) : (
                                        <FiEye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* Password Match Indicator */}
                        {confirmPassword && (
                            <div
                                className={`flex items-center gap-2 text-sm ${newPassword ===
                                    confirmPassword
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}
                            >
                                {newPassword ===
                                    confirmPassword ? (
                                    <>
                                        <FiCheckCircle
                                            size={17}
                                        />
                                        <span>
                                            Passwords match
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FiXCircle
                                            size={17}
                                        />
                                        <span>
                                            Passwords do not match
                                        </span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Reset Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                group
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                bg-blue-600
                                py-3.5
                                text-white
                                font-semibold
                                shadow-lg
                                shadow-blue-600/20
                                transition-all
                                duration-300
                                hover:bg-blue-700
                                hover:-translate-y-0.5
                                disabled:opacity-60
                                disabled:cursor-not-allowed
                            "
                        >
                            {loading
                                ? 'Resetting Password...'
                                : 'Reset Password'}

                            {!loading && (
                                <FiArrowRight
                                    size={19}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 pt-6 border-t border-slate-100">

                        <Link
                            to="/login"
                            className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                text-sm
                                font-medium
                                text-slate-600
                                hover:text-blue-600
                                transition
                            "
                        >
                            <FiArrowLeft size={17} />
                            Back to Login
                        </Link>

                    </div>
                </div>

                {/* Security Message */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        🔐 Your banking information is protected with
                        blockchain-powered security.
                    </p>
                </div>

            </div>

            {/* Popup */}
            {popup.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">

                        {popup.type === 'success' ? (
                            <>
                                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                                    <FiCheckCircle
                                        size={34}
                                        className="text-green-600"
                                    />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Password Reset Successful
                                </h2>

                                <p className="text-gray-500 mb-6">
                                    {popup.message}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleSuccessClose}
                                    className="
                                        w-full
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        font-semibold
                                        py-3
                                        rounded-xl
                                        transition
                                    "
                                >
                                    Go to Login
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
                                    <FiXCircle
                                        size={34}
                                        className="text-red-600"
                                    />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Reset Failed
                                </h2>

                                <p className="text-gray-500 mb-6">
                                    {popup.message}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setPopup({
                                            show: false,
                                            type: '',
                                            message: ''
                                        })
                                    }
                                    className="
                                        w-full
                                        bg-red-600
                                        hover:bg-red-700
                                        text-white
                                        font-semibold
                                        py-3
                                        rounded-xl
                                        transition
                                    "
                                >
                                    Try Again
                                </button>
                            </>
                        )}

                    </div>
                </div>
            )}

        </div>
    )
}

export default ResetPassword