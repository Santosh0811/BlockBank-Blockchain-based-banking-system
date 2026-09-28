import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import Blockchain from '../assets/Blockchain.png'

import {
    FiShield,
    FiDatabase,
    FiServer,
    FiGlobe,
    FiLock,
    FiCheckCircle,
    FiLayers,
    FiArrowRight,
    FiCpu,
    FiCode,
    FiCreditCard,
    FiZap,
    FiLayout,
    FiMail,
    FiCloud
} from 'react-icons/fi'

import {
    SiEthereum,
    SiMongodb,
    SiAlchemy
} from 'react-icons/si'
import BankContext from '../context/BankContext'


const Home = () => {
    const { environment, checkLogin } = useContext(BankContext);

    // =========================================================
    // CHANGE ONLY THIS VALUE
    // =========================================================

    const isProduction = environment === 'production'


    // =========================================================
    // ENVIRONMENT INFORMATION
    // =========================================================

    const environmentInfo = isProduction
        ? {
            name: 'Production',
            description:
                'BlockBank is running in a production environment with cloud services and blockchain infrastructure.',

            frontend: {
                title: 'Frontend',
                value: 'Production Deployment',
                description:
                    'The React application is deployed for production use.',
                icon: FiGlobe,
            },

            backend: {
                title: 'Backend',
                value: 'Render',
                description:
                    'Node.js and Express.js APIs are hosted on Render.',
                icon: FiServer,
            },

            database: {
                title: 'Database',
                value: 'MongoDB Atlas',
                description:
                    'Customer, authentication, KYC and application data are stored securely in MongoDB Atlas.',
                icon: SiMongodb,
            },

            blockchain: {
                title: 'Blockchain',
                value: 'Ethereum Sepolia',
                description:
                    'Smart contracts are deployed on the Ethereum Sepolia test network.',
                icon: SiEthereum,
            },

            rpc: {
                title: 'Blockchain RPC',
                value: 'Alchemy',
                description:
                    'Alchemy provides the RPC connection between the backend and the Ethereum blockchain.',
                icon: SiAlchemy,
            },

            wallet: {
                title: 'Wallet',
                value: 'MetaMask',
                description:
                    'MetaMask is used for blockchain wallet management and transaction signing.',
                icon: FiCreditCard,
            },

            contract: {
                title: 'Smart Contract',
                value: 'Solidity + Ethereum',
                description:
                    'The BlockBank smart contract manages blockchain account balances and financial transactions.',
                icon: FiCode,
            },
        }
        : {
            name: 'Development',
            description:
                'BlockBank is running locally for development and testing using a local blockchain environment.',

            frontend: {
                title: 'Frontend',
                value: 'Localhost + Vite',
                description:
                    'The React application runs locally using the Vite development server.',
                icon: FiGlobe,
            },

            backend: {
                title: 'Backend',
                value: 'Node.js + Express',
                description:
                    'The banking APIs run locally using Node.js and Express.js.',
                icon: FiServer,
            },

            database: {
                title: 'Database',
                value: 'MongoDB Local',
                description:
                    'Application and banking metadata are stored in a local MongoDB database.',
                icon: SiMongodb,
            },

            blockchain: {
                title: 'Blockchain',
                value: 'Ganache',
                description:
                    'Ganache provides a local Ethereum-compatible blockchain for development and testing.',
                icon: SiEthereum,
            },

            rpc: {
                title: 'Blockchain RPC',
                value: 'Localhost',
                description:
                    'The backend connects directly to the local Ganache blockchain through its RPC endpoint.',
                icon: FiCpu,
            },

            wallet: {
                title: 'Wallet',
                value: 'Ganache Account',
                description:
                    'MetaMask can be used to interact with the local blockchain and manage development accounts.',
                icon: FiCreditCard,
            },

            contract: {
                title: 'Smart Contract',
                value: 'Solidity + Ganache',
                description:
                    'The BlockBank smart contract is deployed locally for development and testing.',
                icon: FiCode,
            },
        }

    const developmentStack = [
        { name: 'React', icon: FiLayers },
        { name: 'Vite', icon: FiZap },
        { name: 'Tailwind CSS', icon: FiLayout },
        { name: 'React Icons', icon: FiCode },
        { name: 'Node.js', icon: FiServer },
        { name: 'Express.js', icon: FiServer },
        { name: 'MongoDB', icon: SiMongodb },
        { name: 'Ganache', icon: SiEthereum },
        { name: 'Solidity', icon: FiCode },
        { name: 'Web3.js', icon: FiCode },
        { name: 'Truffle', icon: FiLayers },
        { name: 'Ganache Account', icon: FiCreditCard },
        { name: 'JWT', icon: FiLock },
        { name: 'Nodemailer', icon: FiMail },
        { name: 'Axios', icon: FiArrowRight },
    ]

    const productionStack = [
        { name: 'React', icon: FiLayers },
        { name: 'Vite', icon: FiZap },
        { name: 'Tailwind CSS', icon: FiLayout },
        { name: 'React Icons', icon: FiCode },
        { name: 'Node.js', icon: FiServer },
        { name: 'Express.js', icon: FiServer },
        { name: 'MongoDB Atlas', icon: SiMongodb },
        { name: 'Ethereum Sepolia', icon: SiEthereum },
        { name: 'Solidity', icon: FiCode },
        { name: 'Web3.js', icon: FiCode },
        { name: 'Alchemy', icon: FiCloud },
        { name: 'MetaMask', icon: FiCreditCard },
        { name: 'JWT', icon: FiLock },
        { name: 'Nodemailer', icon: FiMail },
        { name: 'Axios', icon: FiArrowRight },
        { name: 'Render', icon: FiServer },
    ]


    const technologyStack = isProduction ? productionStack : developmentStack

    const productionInfrastructure = [
        {
            icon: FiGlobe,
            label: 'Frontend',
            value: 'Production Deployment'
        },
        {
            icon: FiServer,
            label: 'Backend',
            value: 'Render'
        },
        {
            icon: SiMongodb,
            label: 'Database',
            value: 'MongoDB Atlas'
        },
        {
            icon: SiAlchemy,
            label: 'Blockchain RPC',
            value: 'Alchemy'
        },
        {
            icon: SiEthereum,
            label: 'Blockchain',
            value: 'Ethereum Sepolia'
        },
        {
            icon: FiCreditCard,
            label: 'Wallet',
            value: 'MetaMask'
        }
    ]

    const developmentInfrastructure = [
        {
            icon: FiGlobe,
            label: 'Frontend',
            value: 'localhost + Vite'
        },
        {
            icon: FiServer,
            label: 'Backend',
            value: 'localhost + Node.js'
        },
        {
            icon: SiMongodb,
            label: 'Database',
            value: 'MongoDB Local'
        },
        {
            icon: SiEthereum,
            label: 'Blockchain',
            value: 'Ganache'
        },
        {
            icon: FiCpu,
            label: 'Blockchain RPC',
            value: 'localhost:7545'
        },
        {
            icon: FiCreditCard,
            label: 'Wallet',
            value: 'Ganache Account'
        }
    ]

    const infrastructure = isProduction ? productionInfrastructure : developmentInfrastructure

    useEffect(() => {
        checkLogin()
    }, [])

    return (
        <div className="min-h-screen w-full bg-blue-950">

            <Navbar />

            <div className="w-full flex min-h-[calc(100vh-80px)] items-center justify-center px-10 pt-5 lg:pt-0 lg:px-20">

                <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* ================================================= */}
                    {/* LEFT CONTENT */}
                    {/* ================================================= */}

                    <div className="w-full lg:w-1/2 flex flex-col items-start">

                        {/* Environment Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2">

                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>

                            <span className="text-sm font-medium text-blue-200">
                                {isProduction
                                    ? 'Production Blockchain Banking'
                                    : 'Development Environment'}
                            </span>

                        </div>


                        {/* Heading */}
                        <h1 className="text-4xl md:text-6xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-white">

                            A Secure

                            <span className="block">
                                Blockchain-Based
                            </span>

                            <span className="block text-blue-400">
                                Banking System
                            </span>

                        </h1>


                        {/* Tagline */}
                        <p className="mt-6 text-xl md:text-2xl font-semibold text-white/90">

                            Transparent.

                            <span className="text-blue-400">
                                {' '}Immutable.
                            </span>

                            {' '}Trusted.

                        </p>


                        {/* Description */}
                        <p className="mt-5 max-w-xl text-base md:text-lg leading-7 text-white/60">

                            Experience next-generation banking with the
                            power of blockchain technology. Secure your
                            transactions, maintain transparent records,
                            and take control of your digital banking
                            experience.

                        </p>


                        {/* Buttons */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">

                            <Link
                                to="/login"
                                className="
                                    rounded-lg bg-blue-500 px-5 py-2.5
                                    text-sm font-semibold text-white
                                    shadow-lg shadow-blue-500/20
                                    transition-all duration-300
                                    hover:-translate-y-1 hover:bg-blue-400
                                "
                            >
                                Get Started
                            </Link>


                            <button
                                onClick={() =>
                                    document
                                        .getElementById('learn-more')
                                        ?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        })
                                }
                                className="
                                    rounded-lg border border-white/30
                                    bg-white/5 px-5 py-2.5
                                    text-sm font-semibold text-white
                                    backdrop-blur-sm
                                    transition-all duration-300
                                    hover:border-white/50
                                    hover:bg-white/10
                                    hover:-translate-y-1
                                "
                            >
                                Learn More
                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* RIGHT SIDE */}
                    {/* ================================================= */}

                    <div className="w-full lg:w-1/2 flex justify-center items-center relative flex-col">

                        <div className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]"></div>


                        <div className="relative flex items-center justify-center">

                            <img
                                src={Blockchain}
                                className="
                                    h-72 w-72
                                    md:h-80 md:w-80
                                    lg:h-[420px] lg:w-[420px]
                                    object-contain
                                    blockchain-animation
                                "
                                alt="Blockchain Technology"
                            />

                        </div>


                        {/* Trust Indicators */}
                        <div className="mt-3 flex flex-wrap gap-8">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">

                                    <FiLock className="text-blue-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-white">
                                        Secure
                                    </p>

                                    <p className="text-xs text-white/50">
                                        Protected Transactions
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">

                                    <FiShield className="text-blue-400" />

                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-white">
                                        Transparent
                                    </p>

                                    <p className="text-xs text-white/50">
                                        Blockchain Records
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <section
                id="learn-more"
                className="w-full bg-blue-950 px-6 pt-4 lg:px-20"
            >
                <div className="mx-auto max-w-7xl">

                    {/* Section Header */}
                    <div className="mx-auto max-w-3xl text-center">

                        <span className="
                inline-flex items-center gap-2
                rounded-full
                border border-blue-400/20
                bg-blue-500/10
                px-4 py-2
                text-xs font-semibold
                uppercase tracking-wider
                text-blue-300
            ">
                            <FiLayers />
                            About BlockBank
                        </span>

                        <h2 className="
                mt-5
                text-3xl font-bold
                tracking-tight
                text-white
                md:text-4xl
            ">
                            Secure Banking Powered by
                            <span className="text-blue-400">
                                {' '}Blockchain
                            </span>
                        </h2>

                        <p className="
                mt-5
                text-sm leading-7
                text-white/60
                md:text-base
            ">
                            BlockBank combines modern web technologies with
                            blockchain technology to provide secure account
                            management, financial transactions, and transparent
                            transaction records.
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* CURRENT ENVIRONMENT                               */}
                    {/* ================================================= */}

                    <div className="
            mt-14
            rounded-2xl
            border border-blue-400/20
            bg-blue-500/5
            p-6 md:p-8
        ">

                        <div className="flex items-center gap-4">

                            <div className="
                    flex h-12 w-12 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-400
                ">
                                <FiGlobe size={22} />
                            </div>

                            <div>
                                <p className="
                        text-xs uppercase
                        tracking-wider
                        text-white/40
                    ">
                                    Current Environment
                                </p>

                                <h3 className="
                        mt-1
                        text-xl font-bold
                        text-white
                    ">
                                    {environmentInfo.name}
                                </h3>
                            </div>

                        </div>

                        <p className="
                mt-5
                max-w-4xl
                text-sm leading-6
                text-white/60
            ">
                            {environmentInfo.description}
                        </p>

                    </div>


                    {/* ================================================= */}
                    {/* INFRASTRUCTURE                                    */}
                    {/* ================================================= */}

                    <div className="mt-14">

                        <div className="mb-6">

                            <h3 className="
                    text-2xl font-bold
                    text-white
                ">
                                System Infrastructure
                            </h3>

                            <p className="
                    mt-2
                    text-sm
                    text-white/40
                ">
                                Technologies and services used by the current
                                BlockBank environment.
                            </p>

                        </div>


                        <div className="
                            grid grid-cols-1
                            gap-5
                            md:grid-cols-2
                            lg:grid-cols-3
                        ">

                            <InfrastructureCard
                                data={environmentInfo.frontend}
                            />

                            <InfrastructureCard
                                data={environmentInfo.backend}
                            />

                            <InfrastructureCard
                                data={environmentInfo.database}
                            />

                            <InfrastructureCard
                                data={environmentInfo.blockchain}
                            />

                            <InfrastructureCard
                                data={environmentInfo.rpc}
                            />

                            <InfrastructureCard
                                data={environmentInfo.wallet}
                            />

                            <InfrastructureCard
                                data={environmentInfo.contract}
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* HOW IT WORKS                                      */}
                    {/* ================================================= */}

                    <div className="
            mt-16
            rounded-2xl
            border border-white/10
            bg-white/5
            p-6 md:p-8
        ">

                        <h3 className="
                text-2xl font-bold
                text-white
            ">
                            How BlockBank Works
                        </h3>

                        <p className="
                mt-2
                text-sm
                text-white/40
            ">
                            A transaction moves through the application,
                            backend, smart contract and blockchain.
                        </p>


                        <div className="
                mt-8
                grid grid-cols-2
                gap-8
                md:grid-cols-4
            ">

                            <ProcessStep
                                number="01"
                                icon={FiDatabase}
                                title="Account"
                                description="
                        Customer and banking information is
                        securely managed by the application.
                    "
                            />

                            <ProcessStep
                                number="02"
                                icon={FiArrowRight}
                                title="Transaction"
                                description="
                        Deposits, withdrawals and transfers
                        are initiated through the banking system.
                    "
                            />

                            <ProcessStep
                                number="03"
                                icon={FiCode}
                                title="Smart Contract"
                                description="
                        The Solidity smart contract processes
                        the financial blockchain operation.
                    "
                            />

                            <ProcessStep
                                number="04"
                                icon={FiCheckCircle}
                                title="Verification"
                                description="
                        The blockchain records the transaction
                        and provides an immutable record.
                    "
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* LOCALHOST / PRODUCTION                            */}
                    {/* ================================================= */}

                    <div className="mt-16">

                        <h3 className="
                            text-2xl font-bold
                            text-white
                        ">
                            {isProduction
                                ? 'Production Infrastructure'
                                : 'Development Infrastructure'}
                        </h3>

                        <p className="
                            mt-2
                            text-sm
                            text-white/40
                        ">
                            {isProduction
                                ? 'Cloud services and blockchain infrastructure used in production.'
                                : 'Local services and blockchain infrastructure used during development.'}
                        </p>


                        <div className="
                            mt-6
                            grid grid-cols-1
                            gap-3
                            md:grid-cols-2
                        ">
                            {infrastructure.map((item) => (
                                <InfoRow
                                    key={item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TECHNOLOGY STACK                                  */}
                    {/* ================================================= */}

                    <div className="mt-16">

                        <h3 className="
                            text-2xl font-bold
                            text-white
                        ">
                            Technology Stack
                        </h3>

                        <div className="
                mt-6
                flex flex-wrap
                gap-3
            ">

                            {technologyStack.map((technology) => {

                                const Icon = technology.icon

                                return (
                                    <div
                                        key={technology.name}
                                        className="
                                flex items-center gap-2
                                rounded-lg
                                border border-blue-400/20
                                bg-blue-500/10
                                px-4 py-2.5
                                text-sm
                                font-medium
                                text-blue-200
                            "
                                    >
                                        <Icon size={16} />
                                        {technology.name}
                                    </div>
                                )
                            })}

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* SECURITY                                         */}
                    {/* ================================================= */}

                    <div className="
            mt-16
            grid grid-cols-2
            gap-5
            md:grid-cols-3
        ">

                        <div className="
                rounded-xl
                border border-white/10
                bg-white/5
                p-6
            ">
                            <FiShield
                                className="text-blue-400"
                                size={24}
                            />

                            <h4 className="
                    mt-4
                    font-semibold
                    text-white
                ">
                                Secure
                            </h4>

                            <p className="
                    mt-2
                    text-sm leading-6
                    text-white/50
                ">
                                Authentication, authorization and protected
                                application data help secure the banking system.
                            </p>
                        </div>


                        <div className="
                rounded-xl
                border border-white/10
                bg-white/5
                p-6
            ">
                            <FiLock
                                className="text-blue-400"
                                size={24}
                            />

                            <h4 className="
                    mt-4
                    font-semibold
                    text-white
                ">
                                Immutable
                            </h4>

                            <p className="
                    mt-2
                    text-sm leading-6
                    text-white/50
                ">
                                Blockchain transaction records provide a
                                tamper-resistant history of financial activity.
                            </p>
                        </div>


                        <div className="
                rounded-xl
                border border-white/10
                bg-white/5
                p-6
            ">
                            <FiCheckCircle
                                className="text-blue-400"
                                size={24}
                            />

                            <h4 className="
                    mt-4
                    font-semibold
                    text-white
                ">
                                Transparent
                            </h4>

                            <p className="
                    mt-2
                    text-sm leading-6
                    text-white/50
                ">
                                Blockchain transaction identifiers provide
                                verifiable records of completed transactions.
                            </p>
                        </div>

                    </div>


                    {/* Bottom spacing */}
                    <div className="h-10"></div>

                </div>
            </section>
        </div>
    )
}


/* ============================================================= */
/* INFRASTRUCTURE CARD                                           */
/* ============================================================= */

const InfrastructureCard = ({ data }) => {

    const Icon = data.icon

    return (
        <div className="
            group
            rounded-xl
            border border-white/10
            bg-white/5
            p-5
            transition
            hover:border-blue-400/30
            hover:bg-blue-500/5
        ">

            <div className="flex items-start gap-4">

                <div className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-400
                ">

                    <Icon size={21} />

                </div>


                <div>

                    <p className="text-xs uppercase tracking-wider text-white/40">
                        {data.title}
                    </p>

                    <h4 className="mt-1 font-semibold text-white">
                        {data.value}
                    </h4>

                    <p className="mt-2 text-sm leading-5 text-white/50">
                        {data.description}
                    </p>

                </div>

            </div>

        </div>
    )
}


/* ============================================================= */
/* PROCESS STEP                                                   */
/* ============================================================= */

const ProcessStep = ({
    number,
    icon: Icon,
    title,
    description
}) => {

    return (
        <div>

            <div className="flex items-center gap-3">

                <span className="text-xs font-bold text-blue-400">
                    {number}
                </span>

                <div className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-lg
                    bg-blue-500/10
                    text-blue-400
                ">

                    <Icon />

                </div>

            </div>


            <h4 className="mt-3 font-semibold text-white">
                {title}
            </h4>


            <p className="mt-1 text-xs leading-5 text-white/50">
                {description}
            </p>

        </div>
    )
}


/* ============================================================= */
/* INFO ROW                                                       */
/* ============================================================= */

const InfoRow = ({ icon: Icon, label, value }) => {
    return (
        <div className="
            flex items-center justify-between
            rounded-lg
            border border-white/10
            bg-black/10
            px-4 py-3
        ">
            <div className="flex items-center gap-3">
                <Icon className="text-blue-400" />

                <span className="text-white">
                    {label}
                </span>
            </div>

            <span className="font-medium text-white">
                {value}
            </span>
        </div>
    )
}


export default Home