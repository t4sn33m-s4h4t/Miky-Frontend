"use client";
import { KeySquare } from 'lucide-react'
import React, { useState } from 'react'
import { LoadingButton } from '../Helper/LoadinButton'
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const ForgetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const router = useRouter()

    const handleSubmit = async () => {
        const forgetPassReq = async () => await axios.post(`${BASE_API_URL}/users/forget-password`, { email }, {
            withCredentials: true
        })
        const result = await handleAuthRequest(forgetPassReq, setIsLoading)

        if (result) {
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
            toast.success(result.data.message);
        }
    }

    return (
        <div className='flex items-center justify-center flex-col w-full h-screen'>
            <KeySquare className='w-20 h-20 sm:w-32 sm:h-32 text-primary-350 mb-12' />
            <h1 className='text-primary-400 text-2xl sm:text-3xl font-bold mb-3'>Forget Your Password</h1>
            <p className='mb-6 text-sm sm:text-base text-center text-secondary-700 font-medium'>Enter Your Email to Reset Your Password</p>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Enter Your Email' className='px-6 py-3.5 rounded-lg outline-none bg-secondary-100 block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto' />
            <LoadingButton
                onClick={handleSubmit}
                type='button' isLoading={isLoading} className='w-40 mt-4 bg-secondary-600 text-primary-150 cursor-pointer hover:text-primary-650 hover:bg-primary-250'>Continue</LoadingButton>
        </div>
    )
}

export default ForgetPassword
