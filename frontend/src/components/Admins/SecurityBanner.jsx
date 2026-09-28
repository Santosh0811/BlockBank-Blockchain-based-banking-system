import React from 'react'

import { FiShield } from 'react-icons/fi'


const SecurityBanner = () => {

    return (

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">

                <FiShield size={23} />

            </div>


            <div>

                <h3 className="font-semibold text-blue-950">
                    Blockchain Security
                </h3>

                <p className="mt-1 text-sm text-blue-800">
                    All important financial transactions are
                    securely recorded using blockchain technology.
                </p>

            </div>

        </div>
    )
}


export default SecurityBanner