import React, {
    useContext,
    useEffect,
    useState
} from 'react'

import axios from 'axios'
import toast from 'react-hot-toast'
import BankContext from '../../context/BankContext'

import AdminHeader from './AdminHeader'
import AdminStats from './AdminStats'
import AdminQuickActions from './AdminQuickActions'
import RecentTransactions from './RecentTransactions'
import SecurityBanner from './SecurityBanner'

const AdminDashboard = () => {

    const {
        handleLogout,
        setAdminPage,
        BACKEND_URL
    } = useContext(BankContext)


    const [dashboardData, setDashboardData] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState('')


    // =========================
    // FETCH DASHBOARD DATA
    // =========================

    const fetchDashboard = async () => {

        try {

            setLoading(true)
            setError('')

            const response = await axios.get(
                `${BACKEND_URL}/api/admin/dashboard`,
                {
                    withCredentials: true
                }
            )

            setDashboardData(response.data)

        } catch (error) {

            console.error(
                'Admin dashboard error:',
                error
            )

            toast.error(
                error.response?.data?.message ||
                'Failed to load dashboard'
            )

            setError(
                error.response?.data?.message ||
                'Failed to load dashboard'
            )

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        fetchDashboard()
    }, [])


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

                <div className="flex min-h-screen items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading admin dashboard...
                        </p>

                    </div>

                </div>

            </main>
        )
    }


    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

                <div className="p-6 lg:p-8">

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

                        <h2 className="font-bold text-red-700">
                            Dashboard Error
                        </h2>

                        <p className="mt-2 text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={fetchDashboard}
                            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </main>
        )
    }


    const stats =
        dashboardData?.stats || {}

    const recentTransactions =
        dashboardData?.recentTransactions || []


    return (

        <main className="min-h-screen bg-slate-50 lg:ml-[20vw]">

            {/* Header */}

            <AdminHeader
                handleLogout={handleLogout}
                onRefresh={fetchDashboard}
            />


            <section className="p-6 lg:p-8">

                {/* Page heading */}

                <div className="mb-8">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Welcome back. Here's what's happening today.
                    </p>

                </div>


                {/* Dynamic statistics */}

                <AdminStats
                    stats={stats}
                />


                {/* Quick Actions */}

                <AdminQuickActions
                    setAdminPage={setAdminPage}
                />


                {/* Recent Transactions */}

                <RecentTransactions
                    transactions={recentTransactions}
                    setAdminPage={setAdminPage}
                />


                {/* Security */}

                <SecurityBanner />

            </section>

        </main>
    )
}


export default AdminDashboard