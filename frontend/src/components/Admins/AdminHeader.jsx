import React from 'react'

import {
    FiUser,
    FiRefreshCw
} from 'react-icons/fi'


const AdminHeader = ({
    handleLogout,
    onRefresh
}) => {

    return (

        <header className="hidden h-20 items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">

            <div>

                <h2 className="text-lg font-bold text-slate-900">
                    Admin Panel
                </h2>

                <p className="text-sm text-slate-500">
                    Manage your BlockBank system
                </p>

            </div>


            <div className="flex items-center gap-3">

                {/* Refresh */}

                <button
                    onClick={onRefresh}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >

                    <FiRefreshCw size={17} />

                    Refresh

                </button>


                {/* Admin */}

                <div className="flex items-center gap-3 rounded-xl px-3 py-2">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">

                        <FiUser size={20} />

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-slate-900">
                            Admin
                        </p>

                        <p className="text-xs text-slate-500">
                            Administrator
                        </p>

                    </div>

                </div>


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                    Logout
                </button>

            </div>

        </header>
    )
}


export default AdminHeader