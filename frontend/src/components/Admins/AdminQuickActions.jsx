import React from 'react'

import {
    FiUsers,
    FiUserPlus,
    FiUser
} from 'react-icons/fi'

import { LuArrowLeftRight } from 'react-icons/lu'

const AdminQuickActions = ({
    setAdminPage
}) => {

    return (

        <div className="mt-8">

            <h2 className="mb-4 text-lg font-bold text-slate-900">
                Quick Actions
            </h2>


            <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">


                {/* Create Cashier */}

                <button
                    onClick={() =>
                        setAdminPage(
                            'Create Cashier'
                        )
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-8 w-8 px-2 py-2 lg:px-0 lg:py-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                            <FiUserPlus />

                        </div>


                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Create Cashier
                            </h3>

                            <p className="text-sm text-slate-500">
                                Add a new cashier account
                            </p>

                        </div>

                    </div>

                </button>


                {/* Manage Cashiers */}

                <button
                    onClick={() =>
                        setAdminPage(
                            'Manage Cashiers'
                        )
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-8 w-8 px-2 py-2 lg:px-0 lg:py-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                            <FiUsers />

                        </div>


                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Manage Cashiers
                            </h3>

                            <p className="text-sm text-slate-500">
                                View and manage cashiers
                            </p>

                        </div>

                    </div>

                </button>


                {/* Manage Customers */}

                <button
                    onClick={() =>
                        setAdminPage(
                            'Manage Customers'
                        )
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-8 w-8 px-2 py-2 lg:px-0 lg:py-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                            <FiUser />

                        </div>


                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Manage Customers
                            </h3>

                            <p className="text-sm text-slate-500">
                                View customer accounts
                            </p>

                        </div>

                    </div>

                </button>

                {/* Transactions */}

                <button
                    onClick={() =>
                        setAdminPage(
                            'Transactions'
                        )
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-8 w-8 px-2 py-2 lg:px-0 lg:py-0 items-center justify-center rounded-xl bg-green-100 text-yellow-600">

                            <LuArrowLeftRight />

                        </div>


                        <div>

                            <h3 className="font-semibold text-slate-900">
                                Transactions
                            </h3>

                            <p className="text-sm text-slate-500">
                                View customer transactions
                            </p>

                        </div>

                    </div>

                </button>

            </div>

        </div>
    )
}


export default AdminQuickActions