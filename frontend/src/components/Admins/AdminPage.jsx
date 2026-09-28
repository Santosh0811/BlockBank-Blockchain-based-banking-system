import React, { useContext, useState } from 'react'
import BankContext from '../../context/BankContext';
import { LuLayoutDashboard, LuCircleUserRound, LuArrowLeftRight, LuLogOut, LuMenu, LuX, LuUsers, LuUserCog, LuKey } from 'react-icons/lu'
import { Link } from 'react-router-dom';
import Block from "../../assets/Block.png";
import AdminDashboard from './AdminDashboard';
import CreateCashier from './CreateCashier';
import ManageCashiers from './ManageCashiers';
import ManageCustomers from './ManageCustomers';
import Transactions from './Transactions';
import ChangePassword from './ChangePassword';

const AdminPage = () => {
    const { adminPage, setAdminPage, handleLogout } = useContext(BankContext);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const menuItems = [{
        name: 'Admin Dashboard',
        icon: LuLayoutDashboard
    },
    {
        name: 'Create Cashier',
        icon: LuCircleUserRound
    },
    {
        name: 'Manage Cashiers',
        icon: LuUserCog
    },
    {
        name: 'Manage Customers',
        icon: LuUsers
    },
    {
        name: 'Transactions',
        icon: LuArrowLeftRight
    },
    {
        name: 'Change Password',
        icon: LuKey
    },
    {
        name: 'Logout',
        icon: LuLogOut
    }]

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ================= MOBILE HEADER ================= */}
            <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
                <Link to="/home" className="flex items-center gap-2">
                    <img
                        src={Block}
                        className="h-7"
                        alt="BlockBank logo"
                    />

                    <span className="text-lg font-bold text-blue-950">
                        BlockBank
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
                >
                    <LuMenu className="h-6 w-6" />
                </button>
            </header>

            {/* ================= MOBILE OVERLAY ================= */}
            {isDrawerOpen && (
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside
                className={`
                    fixed left-0 top-0 z-40
                    h-screen w-[280px]
                    bg-blue-950
                    p-4
                    shadow-xl
                    transition-transform duration-300
                    lg:w-[20vw]
                    lg:translate-x-0
                    ${isDrawerOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between pb-6">
                    <Link to="/home" className="flex items-center gap-2 pl-3">
                        <img
                            src={Block}
                            className="h-7"
                            alt="BlockBank logo"
                        />

                        <span className="text-lg font-bold text-white">
                            BlockBank
                        </span>
                    </Link>

                    {/* Mobile Close */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <LuX className="h-5 w-5" />
                    </button>
                </div>

                {/* ================= NAVIGATION ================= */}
                <nav className="mt-5">
                    <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-blue-300">
                        Menu
                    </p>

                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.name}>
                                    {item.name === "Logout" || item.name === "Change Password" && <div className="mt-8 border-t border-blue-900 pt-5" />}
                                    <div
                                        onClick={() => {
                                            setIsDrawerOpen(false);
                                            item.name === "Logout" ? handleLogout() : setAdminPage(item.name)
                                        }}
                                        className={`group flex items-center gap-3 rounded-xl cursor-pointer px-4 py-3 transition-all duration-200 ${item.name === "Logout" ? "text-red-400 hover:bg-red-500/10 hover:text-red-300" : "text-gray-300 hover:bg-blue-900 hover:text-white"}`}
                                    >
                                        <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:${item.name === "Logout" ? "translate-x-1" : "scale-110"}`} />

                                        <span className="font-medium">
                                            {item.name}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* ================= Page CONTENT ================= */}
            {
                adminPage === "Admin Dashboard" ? <AdminDashboard /> : adminPage === "Create Cashier" ? <CreateCashier /> : adminPage === "Manage Cashiers" ? <ManageCashiers /> : adminPage === "Manage Customers" ? <ManageCustomers /> : adminPage === "Transactions" ? <Transactions /> : adminPage === "Change Password" ? <ChangePassword /> : ""
            }
        </div>
    )
}

export default AdminPage
