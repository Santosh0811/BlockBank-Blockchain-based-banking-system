import React, { useContext, useState } from 'react'
import axios from 'axios'
import {
    FiArrowLeft,
    FiLock,
    FiShield,
    FiEye,
    FiEyeOff
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import BankContext from '../../context/BankContext'

const ChangePassword = () => {
    const { setCashierPage, BACKEND_URL } = useContext(BankContext)

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const togglePassword = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            toast('Please fill all fields')
            return
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast('New passwords do not match')
            return
        }

        if (formData.newPassword.length < 6) {
            toast('Password must be at least 6 characters')
            return
        }

        try {
            setLoading(true)

            const response = await axios.put(
                `${BACKEND_URL}/api/cashier/change-password`,
                formData,
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)

                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })

                setCashierPage('Cashier Dashboard')
            }

        } catch (error) {
            console.error(
                'Change password error:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Failed to change password'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}
            <header className="hidden h-20 items-center border-b border-slate-200 bg-white px-8 lg:flex">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Change Password
                    </h2>

                    <p className="text-sm text-slate-500">
                        Update your cashier account password
                    </p>
                </div>
            </header>

            <section className="p-6 lg:p-8">

                <button
                    onClick={() => setCashierPage('Cashier Dashboard')}
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
                >
                    <FiArrowLeft />
                    Back to Dashboard
                </button>

                <div className="mx-auto max-w-xl">

                    {/* Security Header */}
                    <div className="mb-7 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <FiShield size={30} />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-slate-900">
                            Change Password
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep your BlockBank cashier account secure.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
                    >

                        {/* Current Password */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Current Password
                            </label>

                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    name="currentPassword"
                                    type={
                                        showPassword.current
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePassword('current')
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword.current
                                        ? <FiEyeOff />
                                        : <FiEye />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="mb-5">
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                New Password
                            </label>

                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    name="newPassword"
                                    type={
                                        showPassword.new
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePassword('new')
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword.new
                                        ? <FiEyeOff />
                                        : <FiEye />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Confirm New Password
                            </label>

                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                <input
                                    name="confirmPassword"
                                    type={
                                        showPassword.confirm
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        togglePassword('confirm')
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword.confirm
                                        ? <FiEyeOff />
                                        : <FiEye />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm leading-6 text-blue-800">
                                Choose a strong password that you do not use
                                for other accounts.
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? 'Changing Password...'
                                : 'Change Password'
                            }
                        </button>

                    </form>
                </div>
            </section>
        </main>
    )
}

export default ChangePassword