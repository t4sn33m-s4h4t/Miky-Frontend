"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from '../Helper/LoadinButton';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { setAuthUser } from '../../../Store/AuthSlice';
import { toast } from 'sonner';
import Link from 'next/link';

const PasswordReset = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [isLoading, setisLoading] = useState(false);
    const [OTP, setOTP] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async () => {
        if (!OTP || !password) {
            toast.error("OTP and password are required.");
            return;
        }

        const data = { email, otp: OTP, newPassword: password };

        try {
            const resetPassReq = async () =>
                axios.post(`${BASE_API_URL}/users/reset-password`, data, { withCredentials: true });
            const result = await handleAuthRequest(() => resetPassReq(), setisLoading);
            if (result) {
                dispatch(setAuthUser(result.data.data.user));
                toast.success(result.data.message);
                router.push("/auth/login");
            }
        } catch (error) {
            console.log('Error:', error);
            toast.error("Password reset failed. Try again.");
        }
    };

    return (
        <div className='h-screen flex items-center justify-center flex-col'>
            <h1 className='text-primary-400 text-2xl sm:text-3xl font-bold mb-3'>Reset Your Password</h1>
            <p className='mb-6 text-sm sm:text-base text-center text-primary-550 font-medium'>
                Enter your OTP and new password to reset your password.
            </p>
            <input
                onChange={(e) => setOTP(e.target.value)}
                value={OTP}
                type='text'
                placeholder='Enter OTP'
                className='block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto px-6 py-3 bg-secondary-100 rounded-lg no-spinner outline-none'
            />
            <div className="mb-4 mt-4 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] mx-auto">
                <PasswordInput
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name='password'
                    placeholder='Enter New Password'
                    inputClassName='px-6 py-3 rounded-lg outline-none'
                />
            </div>
            <div className="flex items-center space-x-4 mt-6">
                <LoadingButton
                    className='bg-secondary-500 text-secondary-100 cursor-pointer hover:bg-secondary-600'
                    onClick={handleSubmit}
                    isLoading={isLoading}>
                    Change Password
                </LoadingButton>
                <Link href='/auth/forget-password'>
                    <Button className='bg-secondary-500 text-secondary-100 cursor-pointer hover:bg-secondary-600'>
                        Go Back
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default PasswordReset;
