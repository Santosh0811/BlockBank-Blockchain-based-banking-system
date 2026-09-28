import React, { useContext, useState } from 'react'
import Block from '../../assets/Block.png'
import {
    FiArrowLeft,
    FiArrowRight,
    FiShield,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BankContext from '../../context/BankContext'
import toast from 'react-hot-toast'

const VerifyOTP = () => {
    const { BACKEND_URL } = useContext(BankContext);
    const location = useLocation()
    const navigate = useNavigate()

    const email = location.state?.email || ''

    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const [popup, setPopup] = useState({
        show: false,
        type: '',
        message: ''
    })

    const handleVerifyOTP = async (e) => {
        e.preventDefault()

        if (!email) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Email information is missing. Please start the password reset process again.'
            })
            return
        }

        if (otp.length !== 6) {
            setPopup({
                show: true,
                type: 'error',
                message: 'Please enter the 6-digit verification code.'
            })
            return
        }

        try {
            setLoading(true)

            const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`,
                {
                    email,
                    otp
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message);

                navigate('/reset-password', {
                    state: {
                        email
                    }
                })
            }

        } catch (error) {
            console.error('Verify OTP error:', error)

            const message =
                error.response?.data?.message ||
                'Unable to verify OTP. Please try again.'

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center px-4 py-4">

            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-2">
                    <Link to="/home" className="flex items-center gap-3">
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
                            <FiShield
                                className="text-blue-600"
                                size={27}
                            />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Verify OTP
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Enter the verification code sent to your email
                        </p>
                    </div>

                    <div className="mb-6 text-center">
                        <p className="text-sm text-slate-600">
                            We sent a 6-digit verification code to
                        </p>

                        <p className="mt-1 text-sm font-semibold text-blue-600 break-all">
                            {email}
                        </p>
                    </div>

                    <form
                        onSubmit={handleVerifyOTP}
                        className="space-y-5"
                    >

                        <div>
                            <label
                                htmlFor="otp"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                Verification Code
                            </label>

                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 6)
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                autoComplete="one-time-code"
                                required
                                className="
                                    w-full
                                    rounded-lg
                                    border border-slate-300
                                    bg-slate-50
                                    py-3.5
                                    px-4
                                    text-center
                                    text-xl
                                    tracking-[0.2em]
                                    font-semibold
                                    text-slate-800
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-500/20
                                    focus:bg-white
                                "
                            />
                        </div>

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
                                ? 'Verifying...'
                                : 'Verify Code'}

                            {!loading && (
                                <FiArrowRight
                                    size={19}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100">

                        <Link
                            to="/forgot-password"
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
                            Back to Forgot Password
                        </Link>

                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        🔐 Your banking information is protected with
                        blockchain-powered security.
                    </p>
                </div>
            </div>

            {/* Error Popup */}
            {popup.show && popup.type === 'error' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 text-center">

                        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
                            <FiXCircle
                                size={34}
                                className="text-red-600"
                            />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Verification Failed
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

                    </div>
                </div>
            )}

        </div>
    )
}

export default VerifyOTP