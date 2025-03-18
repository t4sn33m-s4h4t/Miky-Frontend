"use client";
import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { PasswordInput } from './PasswordInput';
import { LoadingButton } from '../Helper/LoadinButton';
import Link from 'next/link';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../../Store/AuthSlice';
import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const loginReq = async () => await axios.post(`${BASE_API_URL}/users/login`, formData, {
            withCredentials: true,
        });

        const result = await handleAuthRequest(loginReq, setIsLoading);

        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
            router.push("/");
        }
    };

    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
               
                <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
                    <h1 className='text-primary-400 font-bold text-xl sm:text-2xl text-left uppercase mb-8'>
                        Login with <span className='text-secondary-700'>Miky</span>
                    </h1>
                    <form onSubmit={handleSubmit} className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
                        <div className="mb-4">
                            <label htmlFor="email" className='font-semibold mb-2 block'>
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className='px-4 py-3 bg-secondary-100 rounded-lg w-full block outline-none'
                            />
                        </div>
                        <div className='mb-4'>
                            <PasswordInput
                                value={formData.password}
                                onChange={handleChange}
                                label="Password"
                                name="password"
                                placeholder='Enter Password'
                            />
                            <Link className='mt-2 text-secondary-600 block font-semibold text-base pointer text-right hover:underline' href={"/auth/forget-password"}>Forget Password</Link>
                        </div>
                        <p className="text-sm text-center text-primary-650 mt-3">
                            Don&apos;t have an account?{' '}
                            <Link href="/auth/signup" className="text-primary-500 hover:underline">
                                Sign Up
                            </Link>
                        </p>
                        <LoadingButton
                            isLoading={isLoading}
                            className="w-full mt-3 py-6 text-secondary-100 bg-primary-450 hover:bg-secondary-600 cursor-pointer"
                            type='submit'
                        >
                            Login
                        </LoadingButton>
                    </form>
                </div>
                <div className="lg:col-span-4 h-screen hidden lg:block">
                    <Image
                        src="/images/signup-banner.jpg"
                        alt="Login"
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;