import React, { useContext, useEffect, useState } from 'react'
import Block from '../../assets/Block.png'
import toast from 'react-hot-toast'
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const Login = () => {
    const { BACKEND_URL, checkLogin, checkingAuth } = useContext(BankContext);
    const { loading, setLoading } = useContext(BankContext)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await axios.post(`${BACKEND_URL}/api/auth/login`,
                formData,
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)

                navigate('/verify-login-otp', {
                    state: {
                        email: formData.email.trim().toLowerCase()
                    }
                })
            }

        } catch (error) {
            console.log(error)

            const message =
                error.response?.data?.message ||
                'Login failed. Please try again.'

            toast.error(message)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkLogin()
    }, [navigate])

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">
                    Checking login...
                </p>
            </div>
        )
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

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 md:p-6">

                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Login to your BlockBank account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form
                        onSubmit={handleLogin}
                        className="space-y-5"
                    >

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-semibold text-slate-700"
                            >
                                Email Address
                            </label>

                            <div className="relative">

                                <FiMail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={20}
                                />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    required
                                    className="
                                        w-full
                                        rounded-lg
                                        border border-slate-300
                                        bg-slate-50
                                        py-3.5
                                        pl-12
                                        pr-4
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
                        </div>

                        {/* Password */}
                        <div>

                            <div className="flex items-center justify-between mb-2">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            <div className="relative">

                                <FiLock
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={20}
                                />

                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
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
                                        setShowPassword(!showPassword)
                                    }
                                    className="
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                        hover:text-slate-700
                                    "
                                >
                                    {showPassword
                                        ? <FiEyeOff size={20} />
                                        : <FiEye size={20} />
                                    }
                                </button>

                            </div>
                        </div>

                        {/* Login Button */}
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
                            {loading ? 'Logging in...' : 'Login'}

                            {!loading && (
                                <FiArrowRight
                                    size={19}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            )}
                        </button>

                    </form>

                </div>

                {/* Security Message */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        🔐 Your banking information is protected with
                        blockchain-powered security.
                    </p>
                </div>

            </div>
        </div>
    )
}

export default Login