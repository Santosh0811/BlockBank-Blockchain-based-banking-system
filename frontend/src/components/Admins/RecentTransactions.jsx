import React from 'react'

import {
    FiActivity,
    FiArrowDownLeft,
    FiArrowUpRight
} from 'react-icons/fi'


const RecentTransactions = ({
    transactions,
    setAdminPage
}) => {


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


    const formatDate = date => {

        if (!date) {
            return '-'
        }

        return new Date(date).toLocaleString(
            'en-IN',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
        )
    }


    const getCustomerName = transaction => {

        if (
            transaction.type ===
            'Withdrawal'
        ) {

            return (
                transaction.sender?.fullName ||
                'Unknown Customer'
            )
        }


        return (
            transaction.receiver?.fullName ||
            transaction.sender?.fullName ||
            'Unknown Customer'
        )
    }


    return (

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">


            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 p-5">

                <div>

                    <h2 className="font-bold text-slate-900">
                        Recent Transactions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Latest banking activity
                    </p>

                </div>


                <button
                    onClick={() =>
                        setAdminPage(
                            'Transactions'
                        )
                    }
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    View All
                </button>

            </div>


            {/* Empty */}

            {transactions.length === 0 ? (

                <div className="p-10 text-center">

                    <FiActivity
                        size={35}
                        className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                        No transactions found
                    </p>

                </div>

            ) : (

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px]">

                        <thead>

                            <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">

                                <th className="px-5 py-4">
                                    Transaction
                                </th>

                                <th className="px-5 py-4">
                                    Customer
                                </th>

                                <th className="px-5 py-4">
                                    Type
                                </th>

                                <th className="px-5 py-4">
                                    Amount
                                </th>

                                <th className="px-5 py-4">
                                    Status
                                </th>

                                <th className="px-5 py-4">
                                    Date
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {transactions.map(
                                transaction => (

                                    <tr
                                        key={
                                            transaction._id
                                        }
                                        className="border-b border-slate-100 last:border-0"
                                    >


                                        {/* Transaction */}

                                        <td className="px-5 py-4">

                                            <p className="font-semibold text-slate-800">
                                                {
                                                    transaction.transactionId
                                                }
                                            </p>

                                        </td>


                                        {/* Customer */}

                                        <td className="px-5 py-4 text-sm text-slate-600">

                                            {getCustomerName(
                                                transaction
                                            )}

                                        </td>


                                        {/* Type */}

                                        <td className="px-5 py-4">

                                            <span className="flex items-center gap-2 text-sm">

                                                {transaction.type ===
                                                'Deposit' ? (

                                                    <FiArrowDownLeft className="text-green-600" />

                                                ) : transaction.type ===
                                                  'Withdrawal' ? (

                                                    <FiArrowUpRight className="text-red-500" />

                                                ) : (

                                                    <FiActivity className="text-blue-600" />

                                                )}

                                                {
                                                    transaction.type
                                                }

                                            </span>

                                        </td>


                                        {/* Amount */}

                                        <td className="px-5 py-4 font-semibold text-slate-800">

                                            {formatMoney(
                                                transaction.amount
                                            )}

                                        </td>


                                        {/* Status */}

                                        <td className="px-5 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    transaction.status ===
                                                    'Completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : transaction.status ===
                                                          'Failed'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >

                                                {
                                                    transaction.status
                                                }

                                            </span>

                                        </td>


                                        {/* Date */}

                                        <td className="px-5 py-4 text-sm text-slate-500">

                                            {formatDate(
                                                transaction.timestamp
                                            )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    )
}


export default RecentTransactions