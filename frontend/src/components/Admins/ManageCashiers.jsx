import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import {
    LuSearch,
    LuUsers,
    LuUserCheck,
    LuUserX,
    LuEye,
    LuX,
    LuRefreshCw,
    LuBuilding2,
    LuMail,
    LuPhone,
    LuBadgeCheck
} from 'react-icons/lu'
import BankContext from '../../context/BankContext'
import toast from 'react-hot-toast'

const ManageCashiers = () => {
    const { BACKEND_URL } = useContext(BankContext)
    const [cashiers, setCashiers] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    const [selectedCashier, setSelectedCashier] =
        useState(null)

    const [popup, setPopup] = useState({
        show: false,
        type: '',
        message: ''
    })

    const fetchCashiers = async () => {
        try {
            setLoading(true)

            const response = await axios.get(
                `${BACKEND_URL}/api/admin/cashiers`,
                {
                    withCredentials: true
                }
            )

            setCashiers(response.data.cashiers || [])

        } catch (error) {
            console.error(
                'Fetch cashiers error:',
                error
            )

            toast.error(error.response?.data?.message || 'Failed to load cashiers.')

            setPopup({
                show: true,
                type: 'error',
                message:
                    error.response?.data?.message ||
                    'Failed to load cashiers.'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCashiers()
    }, [])

    const handleStatusChange = async (
        cashier,
        newStatus
    ) => {
        try {
            const response = await axios.put(`${BACKEND_URL}/api/admin/cashiers/${cashier._id}/status`,
                {
                    status: newStatus
                },
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message);

                setCashiers((previous) =>
                    previous.map((item) =>
                        item._id === cashier._id
                            ? {
                                ...item,
                                status: newStatus
                            }
                            : item
                    )
                )

                setSelectedCashier(null)

                setPopup({
                    show: true,
                    type: 'success',
                    message: `Cashier ${newStatus === 'Active'
                        ? 'activated'
                        : 'deactivated'
                        } successfully.`
                })
            }

        } catch (error) {
            console.error(
                'Update cashier status error:',
                error
            )

            const message =
                error.response?.data?.message ||
                'Failed to update cashier status.'

            toast.error(message)

            setPopup({
                show: true,
                type: 'error',
                message:
                    error.response?.data?.message ||
                    'Failed to update cashier status.'
            })
        }
    }

    const filteredCashiers = cashiers.filter(
        (cashier) => {
            const searchText =
                search.toLowerCase().trim()

            return (
                cashier.fullName
                    ?.toLowerCase()
                    .includes(searchText) ||
                cashier.email
                    ?.toLowerCase()
                    .includes(searchText) ||
                cashier.phone
                    ?.toLowerCase()
                    .includes(searchText) ||
                cashier.employeeId
                    ?.toLowerCase()
                    .includes(searchText) ||
                cashier.branch
                    ?.toLowerCase()
                    .includes(searchText)
            )
        }
    )

    const totalCashiers = cashiers.length

    const activeCashiers = cashiers.filter(
        (cashier) =>
            cashier.status === 'Active'
    ).length

    const inactiveCashiers = cashiers.filter(
        (cashier) =>
            cashier.status !== 'Active'
    ).length

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 lg:ml-[20vw]">

            {/* ================= HEADER ================= */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Manage Cashiers
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage BlockBank cashier accounts.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchCashiers}
                    disabled={loading}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:opacity-60
                    "
                >
                    <LuRefreshCw
                        className={
                            loading
                                ? 'animate-spin'
                                : ''
                        }
                        size={18}
                    />

                    Refresh
                </button>

            </div>

            {/* ================= STATS ================= */}

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-6">

                <div className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="flex items-center gap-4">

                        <div className="
                            flex
                            h-8
                            w-8
                            p-1
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-100
                            text-blue-600
                        ">
                            <LuUsers />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Cashiers
                            </p>

                            <p className="text-lg lg:text-xl font-bold text-gray-900">
                                {totalCashiers}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="flex items-center gap-4">

                        <div className="
                            flex
                            h-8
                            w-8
                            p-1
                            items-center
                            justify-center
                            rounded-lg
                            bg-green-100
                            text-green-600
                        ">
                            <LuUserCheck />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Active Cashiers
                            </p>

                            <p className="text-lg lg:text-xl font-bold text-gray-900">
                                {activeCashiers}
                            </p>
                        </div>

                    </div>
                </div>

                <div className="
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                ">
                    <div className="flex items-center gap-4">

                        <div className="
                            flex
                            h-8
                            w-8
                            p-1
                            items-center
                            justify-center
                            rounded-lg
                            bg-red-100
                            text-red-600
                        ">
                            <LuUserX />
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Inactive / Suspended
                            </p>

                            <p className="text-lg lg:text-xl font-bold text-gray-900">
                                {inactiveCashiers}
                            </p>
                        </div>

                    </div>
                </div>

            </div>

            {/* ================= SEARCH ================= */}

            <div className="
                mb-6
                rounded-xl
                border
                border-gray-200
                bg-white
                p-4
                shadow-sm
            ">

                <div className="relative">

                    <LuSearch
                        className="
                            absolute
                            left-4
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
                        size={20}
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Search by name, email, phone, employee ID or branch"
                        className="
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-gray-50
                            py-3
                            pl-11
                            pr-4
                            text-sm
                            text-gray-800
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

            {/* ================= TABLE ================= */}

            <div className="
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-white
                shadow-sm
            ">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px]">

                        <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Cashier
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Employee ID
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Branch
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Phone
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Status
                                </th>

                                <th className="
                                    px-6
                                    py-4
                                    text-right
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-gray-500
                                ">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {loading ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                            text-gray-500
                                        "
                                    >
                                        Loading cashiers...
                                    </td>
                                </tr>

                            ) : filteredCashiers.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="
                                            px-6
                                            py-12
                                            text-center
                                        "
                                    >

                                        <LuUsers
                                            size={40}
                                            className="
                                                mx-auto
                                                mb-3
                                                text-gray-300
                                            "
                                        />

                                        <p className="
                                            font-medium
                                            text-gray-700
                                        ">
                                            No cashiers found
                                        </p>

                                        <p className="
                                            mt-1
                                            text-sm
                                            text-gray-400
                                        ">
                                            Try changing your search.
                                        </p>

                                    </td>
                                </tr>

                            ) : (

                                filteredCashiers.map(
                                    (cashier) => (

                                        <tr
                                            key={cashier._id}
                                            className="
                                                hover:bg-gray-50
                                                transition
                                            "
                                        >

                                            {/* Cashier */}

                                            <td className="px-6 py-4">

                                                <div>
                                                    <p className="
                                                        font-semibold
                                                        text-gray-900
                                                    ">
                                                        {cashier.fullName}
                                                    </p>

                                                    <p className="
                                                        mt-1
                                                        text-xs
                                                        text-gray-400
                                                    ">
                                                        {cashier.email}
                                                    </p>
                                                </div>

                                            </td>

                                            {/* Employee ID */}

                                            <td className="
                                                px-6
                                                py-4
                                                text-sm
                                                font-medium
                                                text-gray-700
                                            ">
                                                {cashier.employeeId}
                                            </td>

                                            {/* Branch */}

                                            <td className="
                                                px-6
                                                py-4
                                            ">
                                                <div className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    text-gray-700
                                                ">
                                                    <LuBuilding2
                                                        size={16}
                                                        className="text-gray-400"
                                                    />

                                                    {cashier.branch}
                                                </div>
                                            </td>

                                            {/* Phone */}

                                            <td className="
                                                px-6
                                                py-4
                                                text-sm
                                                text-gray-600
                                            ">
                                                {cashier.phone}
                                            </td>

                                            {/* Status */}

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        rounded-full
                                                        px-3
                                                        py-1
                                                        text-xs
                                                        font-semibold
                                                        ${cashier.status === 'Active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : cashier.status === 'Suspended'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                        }
                                                    `}
                                                >
                                                    {cashier.status}
                                                </span>

                                            </td>

                                            {/* Action */}

                                            <td className="
                                                px-6
                                                py-4
                                                text-right
                                            ">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCashier(
                                                            cashier
                                                        )
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-lg
                                                        border
                                                        border-gray-200
                                                        px-3
                                                        py-2
                                                        text-sm
                                                        font-medium
                                                        text-gray-700
                                                        transition
                                                        hover:border-blue-200
                                                        hover:bg-blue-50
                                                        hover:text-blue-600
                                                    "
                                                >
                                                    <LuEye size={17} />
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* ================= VIEW MODAL ================= */}

            {selectedCashier && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    backdrop-blur-sm
                    px-4
                ">

                    <div className="
                        w-full
                        max-w-lg
                        max-h-[90vh]
                        overflow-y-auto
                        rounded-2xl
                        bg-white
                        shadow-2xl
                    ">

                        {/* Modal Header */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-100
                            px-6
                            py-5
                        ">

                            <div>
                                <h2 className="
                                    text-xl
                                    font-bold
                                    text-gray-900
                                ">
                                    Cashier Details
                                </h2>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                ">
                                    {selectedCashier.employeeId}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCashier(null)
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-gray-500
                                    hover:bg-gray-100
                                "
                            >
                                <LuX size={20} />
                            </button>

                        </div>

                        {/* Modal Body */}

                        <div className="p-6">

                            <div className="
                                mb-6
                                flex
                                items-center
                                gap-4
                                rounded-xl
                                bg-blue-50
                                p-4
                            ">

                                <div className="
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-blue-600
                                    text-xl
                                    font-bold
                                    text-white
                                ">
                                    {selectedCashier.fullName
                                        ?.charAt(0)
                                        ?.toUpperCase()}
                                </div>

                                <div>
                                    <h3 className="
                                        text-lg
                                        font-bold
                                        text-gray-900
                                    ">
                                        {selectedCashier.fullName}
                                    </h3>

                                    <p className="
                                        text-sm
                                        text-gray-500
                                    ">
                                        {selectedCashier.role}
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-4">

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                ">
                                    <LuMail
                                        className="mt-0.5 text-gray-400"
                                        size={19}
                                    />

                                    <div>
                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Email
                                        </p>

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-gray-800
                                        ">
                                            {selectedCashier.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                ">
                                    <LuPhone
                                        className="mt-0.5 text-gray-400"
                                        size={19}
                                    />

                                    <div>
                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Phone
                                        </p>

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-gray-800
                                        ">
                                            {selectedCashier.phone}
                                        </p>
                                    </div>
                                </div>

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                ">
                                    <LuBadgeCheck
                                        className="mt-0.5 text-gray-400"
                                        size={19}
                                    />

                                    <div>
                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Employee ID
                                        </p>

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-gray-800
                                        ">
                                            {selectedCashier.employeeId}
                                        </p>
                                    </div>
                                </div>

                                <div className="
                                    flex
                                    items-start
                                    gap-3
                                ">
                                    <LuBuilding2
                                        className="mt-0.5 text-gray-400"
                                        size={19}
                                    />

                                    <div>
                                        <p className="
                                            text-xs
                                            text-gray-400
                                        ">
                                            Branch
                                        </p>

                                        <p className="
                                            text-sm
                                            font-medium
                                            text-gray-800
                                        ">
                                            {selectedCashier.branch}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Status */}

                            <div className="
                                mt-6
                                rounded-xl
                                border
                                border-gray-200
                                p-4
                            ">

                                <p className="
                                    mb-2
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-400
                                ">
                                    Account Status
                                </p>

                                <span
                                    className={`
                                        inline-flex
                                        rounded-full
                                        px-3
                                        py-1
                                        text-sm
                                        font-semibold
                                        ${selectedCashier.status === 'Active'
                                            ? 'bg-green-100 text-green-700'
                                            : selectedCashier.status === 'Suspended'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }
                                    `}
                                >
                                    {selectedCashier.status}
                                </span>

                            </div>

                        </div>

                        {/* Modal Footer */}

                        <div className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-gray-100
                            px-6
                            py-5
                            sm:flex-row
                            sm:justify-end
                        ">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCashier(null)
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-gray-300
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    hover:bg-gray-50
                                "
                            >
                                Close
                            </button>

                            {selectedCashier.status === 'Active' ? (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedCashier,
                                            'Inactive'
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        bg-red-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-red-700
                                    "
                                >
                                    Deactivate Cashier
                                </button>

                            ) : (

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedCashier,
                                            'Active'
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        bg-green-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        hover:bg-green-700
                                    "
                                >
                                    Activate Cashier
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}

            {/* ================= POPUP ================= */}

            {popup.show && (

                <div className="
                    fixed
                    inset-0
                    z-[60]
                    flex
                    items-center
                    justify-center
                    bg-black/40
                    backdrop-blur-sm
                    px-4
                ">

                    <div className="
                        w-full
                        max-w-md
                        rounded-2xl
                        bg-white
                        p-8
                        text-center
                        shadow-2xl
                    ">

                        <div
                            className={`
                                mx-auto
                                mb-5
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-full
                                ${popup.type === 'success'
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                                }
                            `}
                        >
                            {popup.type === 'success' ? (
                                <LuUserCheck
                                    size={32}
                                    className="text-green-600"
                                />
                            ) : (
                                <LuUserX
                                    size={32}
                                    className="text-red-600"
                                />
                            )}
                        </div>

                        <h2 className="
                            mb-2
                            text-2xl
                            font-bold
                            text-gray-900
                        ">
                            {popup.type === 'success'
                                ? 'Success'
                                : 'Request Failed'}
                        </h2>

                        <p className="
                            mb-6
                            text-gray-500
                        ">
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
                            className={`
                                w-full
                                rounded-xl
                                py-3
                                font-semibold
                                text-white
                                transition
                                ${popup.type === 'success'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-red-600 hover:bg-red-700'
                                }
                            `}
                        >
                            OK
                        </button>

                    </div>

                </div>

            )}

        </div>
    )
}

export default ManageCashiers