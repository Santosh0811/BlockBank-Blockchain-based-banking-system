import React, { useContext } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Auth/Login'
import CustomerPage from './components/customers/CustomerPage'

import CreateCashier from './components/Admins/CreateCashier'
import CashierPage from './components/cashiers/CashierPage'
import CreateCustomer from './components/cashiers/CreateCustomer'
import ForgotPassword from './components/Auth/ForgotPassword'
import VerifyOTP from './components/Auth/VerifyOTP'
import ResetPassword from './components/Auth/ResetPassword'
import VerifyLoginOTP from './components/Auth/VerifyLoginOTP'
import AdminPage from './components/Admins/AdminPage'
import LoadingBar from "react-top-loading-bar";
import BankContext from './context/BankContext'

const App = () => {
  const { progress, setProgress } = useContext(BankContext);

  return (
    <>
      <LoadingBar
        color="red"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-login-otp' element={<VerifyLoginOTP />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/customerPage' element={<CustomerPage />} />

        <Route path="/admin/dashboard" element={<AdminPage />} />
        <Route path="/admin/create-cashier" element={<CreateCashier />} />

        <Route path="/cashier/dashboard" element={<CashierPage />} />
        <Route path="/cashier/create-customer" element={<CreateCustomer />} />
      </Routes>
    </>
  )
}

export default App
