import React, { useState } from 'react'
import BankContext from './BankContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const BankState = (props) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_LINK
    const environment = import.meta.env.VITE_ENVIRONMENT_KEY

    const [loading, setLoading] = useState(false);
    const [customerPage, setCustomerPage] = useState("Dashboard");
    const [cashierPage, setCashierPage] = useState("Cashier Dashboard");
    const [adminPage, setAdminPage] = useState("Admin Dashboard")
    const [selectedCustomerAccount, setSelectedCustomerAccount] = useState('')
    const [progress, setProgress] = useState(0);

    const navigate = useNavigate()

    const checkLogin = async () => {
        setProgress(45);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/auth/me`,
                {
                    withCredentials: true
                }
            )

            const role = response.data.user.role
            setProgress(75);

            if (role === 'admin') {
                navigate('/admin/dashboard', { replace: true })
            } else if (role === 'cashier') {
                navigate('/cashier/dashboard', { replace: true })
            } else if (role === 'customer') {
                navigate('/customerPage', { replace: true })
            }
        } catch (error) {
            // User is not logged in
        } finally {
            setProgress(100);
        }
    }

    const handleLogout = async () => {
        setProgress(45)
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/logout`,
                {},
                {
                    withCredentials: true
                }
            )
            setProgress(75)

            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/login')
            }

        } catch (error) {
            console.error('Logout error:', error)

            toast.error("Login error");

            // Even if API fails, send user back to login
            navigate('/login')
        } finally {
            setProgress(100)
        }
    }

    return (
        <BankContext.Provider value={{ loading, setLoading, handleLogout, customerPage, setCustomerPage, cashierPage, setCashierPage, selectedCustomerAccount, setSelectedCustomerAccount, adminPage, setAdminPage, BACKEND_URL, environment, checkLogin, progress, setProgress }}>
            {props.children}
        </BankContext.Provider>
    )
}

export default BankState
