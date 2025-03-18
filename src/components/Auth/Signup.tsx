"use client";
import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
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

interface FormData{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}
const Signup = () => {
    const dispathch = useDispatch()
   
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
    });
    const handleChange =(e:ChangeEvent<HTMLInputElement>):void=>{
        const {name, value} = e.target;
        setFormData((prev)=>({...prev, [name]:value}));
    };
      const handleSubmit = async(e:FormEvent)=>{
        e.preventDefault();
        // send request
        const signUpReq = async()=> await axios.post(`${BASE_API_URL}/users/signup`, formData, {
            withCredentials: true,
        })

        const result = await handleAuthRequest(signUpReq, setIsLoading);

        if(result){
            
            dispathch(setAuthUser(result.data.data.user))            
            toast.success(result.data.message)
            router.push("/auth/verify")
        }
      }
    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                <div className="lg:col-span-4 h-screen hidden lg:block">
                    <Image
                        src="/images/signup-banner.jpg"
                        alt="Signup"
                        width={1000}
                        height={1000}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
                    <h1 className='text-primary-400 font-bold text-xl sm:text-2xl textleft uppercase mb-8'>
                        Sign Up With <span className='text-secondary-700'>
                            Miky
                        </span>
                    </h1>
                    <form
                    onSubmit={handleSubmit}
                        className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%]">
                        <div className="mb-4">
                            <label htmlFor="name" className='font-semibold mb-2 block'>
                                Username
                            </label>
                            <input type="text" name='username' placeholder='Username' 
                            value={formData.username}
                            onChange={handleChange} className='px-4 py-3 bg-secondary-100 rounded-lg w-full block outline-none' />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className='font-semibold mb-2 block'>
                                Email
                            </label>
                            <input
                             
                             value={formData.email}
                             onChange={handleChange} 
                              type="email" name='email' placeholder='Email' className='px-4 py-3 bg-secondary-100 rounded-lg w-full block outline-none' />
                        </div>
                        <div className='mb-4'>
                            <PasswordInput  
                            value={formData.password}
                            onChange={handleChange}  label="Password" name="password" placeholder='Enter Password' />
                        </div>
                        <div className='mb-4'>
                            <PasswordInput  
                            value={formData.confirmPassword}
                            onChange={handleChange} 
                            label="Confirm Password" name="confirmPassword" placeholder='Confirm Password' />
                        </div>

                        
                        <p className="text-sm text-center text-primary-650 mt-3">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-primary-500 hover:underline">
                                Login
                            </Link>
                        </p>

                        <LoadingButton isLoading={isLoading} className="w-full mt-3 py-6 text-secondary-100 bg-primary-450 hover:bg-secondary-600 cursor-pointer" type='submit'>
                            Sign Up Now
                        </LoadingButton>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup
