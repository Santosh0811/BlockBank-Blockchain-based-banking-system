import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    LuUser,
    LuIndianRupee,
    LuSend,
    LuWalletCards,
    LuUserRound,
    LuFileText,
    LuShieldCheck,
    LuBlocks,
    LuArrowRight,
    LuCircleCheck,
    LuInfo,
    LuArrowDownLeft,
} from 'react-icons/lu'
import axios from 'axios'
import BankContext from '../../context/BankContext'

const TransferMoney = () => {
    const { setCustomerPage, BACKEND_URL } = useContext(BankContext);

    // =========================================================
    // CUSTOMER DATA
    // =========================================================

    const [customer, setCustomer] = useState(null)
    const [recentTransactions, setRecentTransactions] = useState([])

    const [pageLoading, setPageLoading] = useState(true)
    const [pageError, setPageError] = useState('')


    // =========================================================
    // TRANSFER FORM
    // =========================================================

    const [receiver, setReceiver] = useState('')
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')

    const [receiverDetails, setReceiverDetails] = useState(null)

    const [showPreview, setShowPreview] = useState(false)
    const [loadingReceiver, setLoadingReceiver] = useState(false)
    const [transferLoading, setTransferLoading] = useState(false)

    const [successData, setSuccessData] = useState(null)

    const fee = 0

    const transferAmount = Number(amount) || 0

    const total = transferAmount + fee


    // =========================================================
    // GET CUSTOMER PROFILE + TRANSACTIONS
    // =========================================================

    useEffect(() => {

        const getData = async () => {

            try {

                setPageLoading(true)
                setPageError('')

                const [
                    customerResponse,
                    transactionResponse
                ] = await Promise.all([

                    axios.get(
                        `${BACKEND_URL}/api/customer/profile`,
                        {
                            withCredentials: true
                        }
                    ),

                    axios.get(
                        `${BACKEND_URL}/api/customer/transactions`,
                        {
                            withCredentials: true
                        }
                    )

                ])

                setCustomer(
                    customerResponse.data.customer
                )

                const transactions =
                    transactionResponse.data.transactions || []

                // Only show recent transfers
                const transfers = transactions
                    .filter(
                        (transaction) =>
                            transaction.type === 'Transfer'
                    )
                    .slice(0, 3)

                setRecentTransactions(transfers)

            } catch (error) {

                console.error(
                    'Get transfer page data error:',
                    error
                )

                toast.error(error.response?.data?.message ||
                    'Failed to load account information')

                setPageError(
                    error.response?.data?.message ||
                    'Failed to load account information'
                )

            } finally {

                setPageLoading(false)

            }

        }

        getData()

    }, [])


    const handleReviewTransfer = async (e) => {
        e.preventDefault()

        const transferAmount = Number(amount)

        if (!receiver.trim()) {
            toast('Please enter receiver account number')
            return
        }

        if (!transferAmount || transferAmount <= 0) {
            toast('Please enter a valid amount')
            return
        }

        if (Math.round(transferAmount * 100) !== transferAmount * 100) {
            toast('Amount can have maximum 2 decimal places')
            return
        }

        if (transferAmount > Number(customer?.balance || 0)) {
            toast('Insufficient balance')
            return
        }

        try {
            setLoadingReceiver(true)

            const response = await axios.get(
                `${BACKEND_URL}/api/customer/verify-receiver?receiverAccount=${encodeURIComponent(
                    receiver.trim()
                )}`,
                {
                    withCredentials: true
                }
            )

            setReceiverDetails(response.data.receiver)
            setShowPreview(true)
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Unable to verify receiver'
            )
        } finally {
            setLoadingReceiver(false)
        }
    }

    const handleConfirmTransfer = async () => {
        try {
            setTransferLoading(true)

            const response = await axios.post(`${BACKEND_URL}/api/customer/transfer`,
                {
                    receiverAccount: receiverDetails.accountNumber,
                    amount: Number(amount),
                    description: description.trim()
                },
                {
                    withCredentials: true
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message)
                setShowPreview(false)

                setSuccessData(response.data)
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Transfer failed'
            )
        } finally {
            setTransferLoading(false)
        }
    }

    // =========================================================
    // LOADING
    // =========================================================

    if (pageLoading) {

        return (

            <main className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-gray-50
                lg:ml-[20vw]
            ">

                <div className="text-center">

                    <div className="
                        mx-auto
                        mb-4
                        h-10
                        w-10
                        animate-spin
                        rounded-full
                        border-4
                        border-gray-200
                        border-t-blue-600
                    "></div>

                    <p className="
                        text-sm
                        text-gray-500
                    ">
                        Loading account information...
                    </p>

                </div>

            </main>

        )

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (pageError || !customer) {

        return (

            <main className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-gray-50
                lg:ml-[20vw]
            ">

                <div className="
                    rounded-2xl
                    border
                    border-red-100
                    bg-white
                    p-8
                    text-center
                    shadow-sm
                ">

                    <p className="
                        font-semibold
                        text-red-600
                    ">
                        {pageError ||
                            'Unable to load account information'}
                    </p>


                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                        className="
                            mt-4
                            rounded-lg
                            bg-blue-600
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "
                    >
                        Try Again
                    </button>

                </div>

            </main>

        )

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <main className="
            min-h-screen
            bg-gray-50
            lg:ml-[20vw]
        ">


            {/* ================================================= */}
            {/* TOP BAR */}
            {/* ================================================= */}

            <header className="
                          hidden
                          h-20
                          items-center
                          justify-end
                          border-b
                          border-gray-200
                          bg-white
                          px-8
                          lg:flex
                      ">

                <div className="flex items-center gap-5">


                    {/* Notification */}

                    <button
                        className="
                                      relative
                                      flex
                                      h-10
                                      w-10
                                      items-center
                                      justify-center
                                      rounded-xl
                                      text-gray-600
                                      transition
                                      hover:bg-gray-100
                                  "
                    >

                        🔔

                        <span className="
                                      absolute
                                      right-2
                                      top-2
                                      h-2
                                      w-2
                                      rounded-full
                                      bg-red-500
                                  "></span>

                    </button>


                    {/* Profile */}

                    <div className="
                                  flex
                                  items-center
                                  gap-3
                                  rounded-xl
                                  px-3
                                  py-2
                              ">
                        <button
                            type="button"
                            onClick={() =>
                                setCustomerPage("Profile")
                            }
                            className="
                                      flex
                                      items-center
                                      gap-3
                                      rounded-xl
                                      px-3
                                      py-2
                                      transition
                                      hover:bg-gray-50
                                  "
                        >

                            <div className="
                                      flex
                                      h-10
                                      w-10
                                      items-center
                                      justify-center
                                      rounded-full
                                      bg-blue-100
                                      text-blue-700
                                  ">

                                <LuUser size={20} />

                            </div>


                            <div className="text-left">

                                <p className="
                                          text-sm
                                          font-semibold
                                          text-gray-900
                                      ">
                                    {customer.fullName}
                                </p>

                                <p className="
                                          text-xs
                                          text-gray-500
                                      ">
                                    Customer
                                </p>

                            </div>

                        </button>

                    </div>

                </div>

            </header>


            {/* ================================================= */}
            {/* PAGE CONTENT */}
            {/* ================================================= */}

            <section className="
                p-5
                sm:p-6
                lg:p-8
            ">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div>

                    <h1 className="
                        text-2xl
                        font-bold
                        text-gray-900
                        sm:text-3xl
                    ">
                        Transfer Money
                    </h1>

                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                        sm:text-base
                    ">
                        Send money securely using your BlockBank account.
                    </p>

                </div>


                {/* ================================================= */}
                {/* MAIN GRID */}
                {/* ================================================= */}

                <div className="
                    mt-8
                    grid
                    gap-6
                    xl:grid-cols-[1.4fr_0.8fr]
                ">


                    {/* ================================================= */}
                    {/* TRANSFER FORM */}
                    {/* ================================================= */}

                    <div className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        p-6
                        shadow-sm
                        sm:p-8
                    ">


                        {/* Form Header */}

                        <div className="
                            flex
                            items-center
                            gap-4
                            border-b
                            border-gray-100
                            pb-6
                        ">

                            <div className="
                                flex
                                h-12
                                w-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-100
                                text-blue-600
                            ">

                                <LuSend size={24} />

                            </div>


                            <div>

                                <h2 className="
                                    text-lg
                                    font-bold
                                    text-gray-900
                                ">
                                    Send Money
                                </h2>

                                <p className="
                                    mt-1
                                    text-sm
                                    text-gray-500
                                ">
                                    Enter the receiver's details below.
                                </p>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* FORM */}
                        {/* ================================================= */}

                        <form
                            onSubmit={handleReviewTransfer}
                            className="
                                mt-6
                                space-y-6
                            "
                        >


                            {/* ================================================= */}
                            {/* SENDER */}
                            {/* ================================================= */}

                            <div>

                                <label className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                ">
                                    From Account
                                </label>


                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-blue-100
                                    bg-blue-50
                                    p-4
                                ">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                    ">

                                        <div className="
                                            flex
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-white
                                            text-blue-600
                                        ">

                                            <LuWalletCards size={21} />

                                        </div>


                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                {customer.fullName}
                                            </p>

                                            <p className="
                                                text-xs
                                                text-gray-500
                                            ">
                                                A/C: {customer.accountNumber}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="text-right">

                                        <p className="
                                            text-xs
                                            text-gray-500
                                        ">
                                            Available
                                        </p>

                                        <p className="
                                            mt-1
                                            flex
                                            items-center
                                            gap-1
                                            text-sm
                                            font-bold
                                            text-gray-900
                                        ">

                                            <LuIndianRupee
                                                size={15}
                                                strokeWidth={3}
                                            />

                                            {Number(
                                                customer.balance || 0
                                            ).toFixed(2)}

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* RECEIVER */}
                            {/* ================================================= */}

                            <div>

                                <label
                                    htmlFor="receiver"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    Receiver Account Number
                                </label>


                                <div className="relative">

                                    <LuUserRound
                                        size={19}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-400
                                        "
                                    />


                                    <input
                                        id="receiver"
                                        type="text"
                                        value={receiver}
                                        onChange={(e) =>
                                            setReceiver(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter account number"
                                        required
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            py-3.5
                                            pl-11
                                            pr-4
                                            text-sm
                                            text-gray-800
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-blue-500/10
                                        "
                                    />

                                </div>


                                <p className="
                                    mt-2
                                    text-xs
                                    text-gray-400
                                ">
                                    Make sure the account number is correct.
                                </p>

                            </div>


                            {/* ================================================= */}
                            {/* AMOUNT */}
                            {/* ================================================= */}

                            <div>

                                <label
                                    htmlFor="amount"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    Transfer Amount
                                </label>


                                <div className="relative">

                                    <LuIndianRupee
                                        size={21}
                                        strokeWidth={3}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="amount"
                                        type="number"
                                        min="0.01"
                                        max={Number(
                                            customer.balance || 0
                                        )}
                                        step="0.01"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        required
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            py-4
                                            pl-12
                                            pr-4
                                            text-xl
                                            font-bold
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-blue-500/10
                                        "
                                    />

                                </div>


                                <div className="
                                    mt-2
                                    flex
                                    justify-between
                                    text-xs
                                ">

                                    <span className="text-gray-400">
                                        Available balance
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-gray-600
                                    ">
                                        ₹{Number(
                                            customer.balance || 0
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* DESCRIPTION */}
                            {/* ================================================= */}

                            <div>

                                <label
                                    htmlFor="description"
                                    className="
                                        mb-2
                                        block
                                        text-sm
                                        font-semibold
                                        text-gray-700
                                    "
                                >
                                    Description

                                    <span className="
                                        ml-1
                                        font-normal
                                        text-gray-400
                                    ">
                                        (Optional)
                                    </span>

                                </label>


                                <div className="relative">

                                    <LuFileText
                                        size={19}
                                        className="
                                            absolute
                                            left-4
                                            top-4
                                            text-gray-400
                                        "
                                    />


                                    <textarea
                                        id="description"
                                        rows="3"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        placeholder="What is this transfer for?"
                                        className="
                                            w-full
                                            resize-none
                                            rounded-lg
                                            border
                                            border-gray-200
                                            bg-gray-50
                                            py-3.5
                                            pl-11
                                            pr-4
                                            text-sm
                                            text-gray-800
                                            outline-none
                                            transition
                                            focus:border-blue-500
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-blue-500/10
                                        "
                                    />

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* SUMMARY */}
                            {/* ================================================= */}

                            <div className="
                                rounded-xl
                                border
                                border-gray-100
                                bg-gray-50
                                p-5
                            ">

                                <h3 className="
                                    text-sm
                                    font-bold
                                    text-gray-800
                                ">
                                    Transfer Summary
                                </h3>


                                <div className="
                                    mt-4
                                    space-y-3
                                    text-sm
                                ">

                                    <div className="
                                        flex
                                        justify-between
                                        text-gray-500
                                    ">

                                        <span>
                                            Transfer Amount
                                        </span>

                                        <span className="
                                            font-semibold
                                            text-gray-800
                                        ">
                                            ₹{transferAmount.toFixed(2)}
                                        </span>

                                    </div>


                                    <div className="
                                        flex
                                        justify-between
                                        text-gray-500
                                    ">

                                        <span>
                                            Transaction Fee
                                        </span>

                                        <span className="
                                            font-semibold
                                            text-green-600
                                        ">
                                            Free
                                        </span>

                                    </div>


                                    <div className="
                                        flex
                                        justify-between
                                        border-t
                                        border-gray-200
                                        pt-3
                                    ">

                                        <span className="
                                            font-semibold
                                            text-gray-800
                                        ">
                                            Total
                                        </span>


                                        <span className="
                                            flex
                                            items-center
                                            gap-1
                                            font-bold
                                            text-gray-900
                                        ">

                                            <LuIndianRupee
                                                size={16}
                                                strokeWidth={3}
                                            />

                                            {total.toFixed(2)}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* SECURITY */}
                            {/* ================================================= */}

                            <div className="
                                flex
                                gap-3
                                rounded-xl
                                border
                                border-green-100
                                bg-green-50
                                p-4
                            ">

                                <LuShieldCheck
                                    size={21}
                                    className="
                                        shrink-0
                                        text-green-600
                                    "
                                />

                                <p className="
                                    text-xs
                                    leading-5
                                    text-green-800
                                ">
                                    This transaction will be securely recorded
                                    on the BlockBank blockchain after confirmation.
                                </p>

                            </div>


                            {/* ================================================= */}
                            {/* TRANSFER BUTTON */}
                            {/* ================================================= */}

                            <button
                                type="submit"
                                disabled={
                                    loadingReceiver ||
                                    !receiver ||
                                    !transferAmount ||
                                    transferAmount <= 0 ||
                                    transferAmount > Number(customer.balance || 0)
                                }
                                className="
        group
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        bg-blue-600
        py-3.5
        text-sm
        font-semibold
        text-white
        shadow-lg
        shadow-blue-600/20
        transition
        hover:bg-blue-700
        disabled:cursor-not-allowed
        disabled:bg-gray-300
        disabled:shadow-none
    "
                            >
                                <LuSend size={18} />

                                {loadingReceiver
                                    ? 'Verifying Receiver...'
                                    : 'Review Transfer'}

                                {!loadingReceiver && (
                                    <LuArrowRight
                                        size={18}
                                        className="transition group-hover:translate-x-1"
                                    />
                                )}
                            </button>

                        </form>

                    </div>


                    {/* ================================================= */}
                    {/* RIGHT SIDE */}
                    {/* ================================================= */}

                    <div className="space-y-6">

                        {/* ================================================= */}
                        {/* TRANSFER INFORMATION */}
                        {/* ================================================= */}

                        <div className="
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-6
                            shadow-sm
                        ">

                            <div className="
                                flex
                                items-center
                                gap-3
                            ">

                                <div className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-orange-100
                                    text-orange-600
                                ">

                                    <LuInfo size={20} />

                                </div>


                                <div>

                                    <h3 className="
                                        text-sm
                                        font-bold
                                        text-gray-900
                                    ">
                                        Transfer Information
                                    </h3>

                                    <p className="
                                        text-xs
                                        text-gray-500
                                    ">
                                        Please review before sending.
                                    </p>

                                </div>

                            </div>


                            <div className="
                                mt-5
                                space-y-3
                                text-sm
                            ">


                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="text-gray-500">
                                        Available Balance
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-gray-800
                                    ">
                                        ₹{Number(
                                            customer.balance || 0
                                        ).toFixed(2)}
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="text-gray-500">
                                        Transfer Fee
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-green-600
                                    ">
                                        Free
                                    </span>

                                </div>


                                <div className="
                                    flex
                                    justify-between
                                ">

                                    <span className="text-gray-500">
                                        Processing
                                    </span>

                                    <span className="
                                        font-semibold
                                        text-gray-800
                                    ">
                                        Instant
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* RECENT TRANSFERS */}
                        {/* ================================================= */}

                        <div className="
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-6
                            shadow-sm
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                            ">

                                <h3 className="
                                    font-bold
                                    text-gray-900
                                ">
                                    Recent Transfers
                                </h3>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setCustomerPage("Transactions")
                                    }
                                    className="
                                        text-xs
                                        font-semibold
                                        text-blue-600
                                        hover:text-blue-700
                                    "
                                >
                                    View All
                                </button>

                            </div>


                            <div className="
                                mt-5
                                space-y-4
                            ">


                                {recentTransactions.length === 0 ? (

                                    <div className="
                                        py-5
                                        text-center
                                    ">

                                        <LuSend
                                            size={28}
                                            className="
                                                mx-auto
                                                text-gray-300
                                            "
                                        />

                                        <p className="
                                            mt-2
                                            text-sm
                                            text-gray-500
                                        ">
                                            No transfers yet
                                        </p>

                                    </div>

                                ) : (

                                    recentTransactions.map(
                                        (transaction) => {

                                            const isReceived =
                                                transaction.receiver?._id ===
                                                customer._id ||
                                                transaction.receiver ===
                                                customer._id

                                            const otherPerson =
                                                isReceived
                                                    ? (
                                                        transaction.sender?.fullName ||
                                                        transaction.senderAccount ||
                                                        'Unknown'
                                                    )
                                                    : (
                                                        transaction.receiver?.fullName ||
                                                        transaction.receiverAccount ||
                                                        'Unknown'
                                                    )

                                            return (

                                                <div
                                                    key={transaction._id}
                                                    className="
                                                        flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >

                                                    <div className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    ">

                                                        <div className={`
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            ${isReceived
                                                                ? 'bg-green-100 text-green-600'
                                                                : 'bg-blue-100 text-blue-600'
                                                            }
                                                        `}>

                                                            {isReceived ? (
                                                                <LuArrowDownLeft
                                                                    size={17}
                                                                />
                                                            ) : (
                                                                <LuUser
                                                                    size={17}
                                                                />
                                                            )}

                                                        </div>


                                                        <div>

                                                            <p className="
                                                                text-sm
                                                                font-semibold
                                                                text-gray-800
                                                            ">
                                                                {otherPerson}
                                                            </p>

                                                            <p className="
                                                                text-xs
                                                                text-gray-400
                                                            ">
                                                                {formatDateTime(
                                                                    transaction.timestamp ||
                                                                    transaction.createdAt
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <p
                                                        className={`
                                                            text-sm
                                                            font-bold
                                                            ${isReceived
                                                                ? 'text-green-600'
                                                                : 'text-gray-800'
                                                            }
                                                        `}
                                                    >
                                                        {isReceived
                                                            ? '+'
                                                            : '-'
                                                        }₹
                                                        {Number(
                                                            transaction.amount || 0
                                                        ).toFixed(2)}
                                                    </p>

                                                </div>

                                            )

                                        }
                                    )

                                )}

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* BLOCKCHAIN CARD */}
                        {/* ================================================= */}

                        <div className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-blue-100
                            bg-white
                            shadow-sm
                        ">

                            <div className="
                                bg-gradient-to-br
                                from-blue-700
                                to-blue-500
                                p-6
                                text-white
                            ">

                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                ">

                                    <div className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-white/15
                                    ">

                                        <LuBlocks size={26} />

                                    </div>


                                    <span className="
                                        rounded-full
                                        bg-white/15
                                        px-3
                                        py-1
                                        text-xs
                                        font-semibold
                                    ">
                                        Secure
                                    </span>

                                </div>


                                <h2 className="
                                    mt-5
                                    text-xl
                                    font-bold
                                ">
                                    Blockchain Protected
                                </h2>


                                <p className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-blue-100
                                ">
                                    Your transfer is protected by a
                                    tamper-resistant blockchain ledger.
                                </p>

                            </div>


                            <div className="p-6">

                                <div className="space-y-4">


                                    <div className="flex gap-3">

                                        <LuCircleCheck
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-green-500
                                            "
                                            size={20}
                                        />

                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                Transaction Verification
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-gray-500
                                            ">
                                                Every transaction is validated
                                                before being recorded.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex gap-3">

                                        <LuCircleCheck
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-green-500
                                            "
                                            size={20}
                                        />

                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                Immutable Records
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-gray-500
                                            ">
                                                Completed transactions cannot
                                                be altered.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex gap-3">

                                        <LuCircleCheck
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-green-500
                                            "
                                            size={20}
                                        />

                                        <div>

                                            <p className="
                                                text-sm
                                                font-semibold
                                                text-gray-800
                                            ">
                                                Transparent History
                                            </p>

                                            <p className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-gray-500
                                            ">
                                                Verify transactions using their
                                                blockchain hash.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {showPreview && receiverDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="border-b border-slate-200 px-6 py-5">
                            <h2 className="text-xl font-bold text-slate-900">
                                Review Transfer
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Please verify the recipient and transfer details
                                before confirming.
                            </p>
                        </div>

                        {/* Receiver */}
                        <div className="px-6 py-5">

                            <div className="mb-5 rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Receiver
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                                        {receiverDetails.fullName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            {receiverDetails.fullName}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {receiverDetails.accountNumber}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {receiverDetails.accountType} Account
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer Details */}
                            <div className="space-y-4">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Amount
                                    </span>

                                    <span className="text-lg font-bold text-slate-900">
                                        ₹{Number(amount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">
                                        Transfer Fee
                                    </span>

                                    <span className="font-medium text-slate-900">
                                        ₹0.00
                                    </span>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-900">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold text-blue-600">
                                            ₹{Number(amount).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {description.trim() && (
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Description
                                        </p>

                                        <p className="mt-1 font-medium text-slate-900">
                                            {description}
                                        </p>
                                    </div>
                                )}

                            </div>

                            {/* Warning */}
                            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                <p className="text-sm font-medium text-amber-800">
                                    Please verify the receiver's name and account
                                    number carefully. This transfer cannot be
                                    reversed after confirmation.
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 border-t border-slate-200 px-6 py-5">

                            <button
                                type="button"
                                onClick={() => setShowPreview(false)}
                                disabled={transferLoading}
                                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Go Back
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmTransfer}
                                disabled={transferLoading}
                                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {transferLoading
                                    ? 'Processing...'
                                    : 'Confirm Transfer'}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            {successData && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <span className="text-3xl text-green-600">
                                ✓
                            </span>
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-slate-900">
                            Transfer Successful
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            ₹{Number(successData.transaction?.amount || amount).toFixed(2)}
                            {' '}has been transferred successfully to{' '}
                            {receiverDetails?.fullName}.
                        </p>

                        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
                            <div className="flex justify-between py-2">
                                <span className="text-sm text-slate-500">
                                    Transaction ID
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {successData.transaction?.transactionId}
                                </span>
                            </div>

                            <div className="flex justify-between py-2">
                                <span className="text-sm text-slate-500">
                                    Receiver
                                </span>

                                <span className="text-sm font-semibold text-slate-900">
                                    {receiverDetails?.fullName}
                                </span>
                            </div>

                            <div className="flex justify-between py-2">
                                <span className="text-sm text-slate-500">
                                    Status
                                </span>

                                <span className="text-sm font-semibold text-green-600">
                                    Completed
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => { setCustomerPage("Transactions") }}
                            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            View Transactions
                        </button>

                    </div>
                </div>
            )}

        </main>

    )
}


// =============================================================
// DATE FORMATTER
// =============================================================

const formatDateTime = (date) => {

    if (!date) {
        return 'Date unavailable'
    }

    return new Date(date).toLocaleString(
        'en-IN',
        {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }
    )

}


export default TransferMoney