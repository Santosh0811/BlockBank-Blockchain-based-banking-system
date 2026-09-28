import React from 'react'

import {
    FiUsers,
    FiUser,
    FiActivity,
    FiCreditCard
} from 'react-icons/fi'


const AdminStats = ({ stats }) => {

    const formatMoney = amount => {

        return new Intl.NumberFormat(
            'en-IN',
            {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        )
    }


    const statItems = [

        {
            title: 'Total Cashiers',

            value:
                stats.totalCashiers || 0,

            icon:
                <FiUsers />,

            text:
                `${stats.activeCashiers || 0} active cashiers`
        },


        {
            title: 'Total Customers',

            value:
                stats.totalCustomers || 0,

            icon:
                <FiUser />,

            text:
                `${stats.activeCustomers || 0} active customers`
        },


        {
            title: 'Transactions',

            value:
                stats.totalTransactions || 0,

            icon:
                <FiActivity />,

            text:
                `${stats.completedTransactions || 0} completed`
        },


        {
            title: 'Total Deposits',

            value:
                formatMoney(
                    stats.totalDeposits
                ),

            icon:
                <FiCreditCard />,

            text:
                'Processed deposits'
        }

    ]


    return (

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">

            {statItems.map(
                (stat, index) => (

                    <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm text-slate-500">
                                    {stat.title}
                                </p>

                                <h2 className="mt-2 text:lg lg:text-xl font-bold text-slate-900">
                                    {stat.value}
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    {stat.text}
                                </p>

                            </div>


                            <div className="flex h-8 w-8 p-1 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                                {stat.icon}

                            </div>

                        </div>

                    </div>

                )
            )}

        </div>
    )
}


export default AdminStats