import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
    FiUser,
    FiMail,
    FiPhone,
    FiBriefcase,
    FiArrowLeft,
    FiUserPlus
} from 'react-icons/fi'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const CreateCashier = () => {
    const { setAdminPage, BACKEND_URL } = useContext(BankContext);

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        branch: '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleCreateCashier = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const response = await axios.post(
                `${BACKEND_URL}/api/admin/cashiers`,
                {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    branch: formData.branch,
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
                    branch: '',
                })
                // Go to admin dashboard
                setAdminPage("Admin Dashboard")
            }

        } catch (error) {
            console.error('Create cashier error:', error)

            toast.error(
                error.response?.data?.message ||
                'Failed to create cashier'
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
                        Create Cashier
                    </h2>

                    <p className="text-sm text-slate-500">
                        Create a new cashier account
                    </p>
                </div>

            </header>

            <section className="p-6 lg:p-8">

                <div
                    onClick={() => setAdminPage("Admin Dashboard")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 cursor-pointer"
                >
                    <FiArrowLeft />
                    Back to Dashboard
                </div>

                <div className="mx-auto max-w-3xl">

                    <div className="mb-7">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Create Cashier Account
                        </h1>

                        <p className="mt-1 text-slate-500">
                            Add a new cashier to the BlockBank system.
                        </p>
                    </div>

                    <form
                        onSubmit={handleCreateCashier}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
                    >

                        {/* Personal Information */}
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

                                    <div className="relative">

                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Enter full name"
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                                        <input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            type="email"
                                            placeholder="cashier@blockbank.com"
                                            required
                                            className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3.5 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone Number
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

                            </div>

                        </div>

                        {/* Employee Information */}
                        <div className="mb-8 border-t border-slate-200 pt-8">

                            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <FiBriefcase className="text-blue-600" />
                                Employee Information
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Branch
                                    </label>

                                    <select
                                        name="branch"
                                        value={formData.branch}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="">
                                            Select branch
                                        </option>

                                        <option value="Mumbai">
                                            Mumbai
                                        </option>

                                        <option value="Pune">
                                            Pune
                                        </option>

                                        <option value="Delhi">
                                            Delhi
                                        </option>

                                        <option value="Bangalore">
                                            Bangalore
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex justify-end">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                            >
                                <FiUserPlus />
                                {loading ? 'Creating...' : 'Create Cashier'}
                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    )
}

export default CreateCashier