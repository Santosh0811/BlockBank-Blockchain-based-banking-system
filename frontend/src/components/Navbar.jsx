import React from 'react'
import { Link } from 'react-router-dom'
import Block from '../assets/Block.png';

const Navbar = () => {
    return (
        <div>
            <nav className="bg-transparent w-full">
                <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4 text-white">
                    <Link to="/home" className="flex items-center gap-2">
                        <img src={Block} className="h-7" alt="BlockBank logo" />
                        <span className="self-center text-xl text-heading font-bold whitespace-nowrap">BlockBank</span>
                    </Link>


                    <Link to="/login" className='border border-blue-500 bg-blue-500 px-2 py-1 rounded-lg font-bold'>
                        Login
                    </Link>
                </div>
            </nav >

        </div >
    )
}

export default Navbar
