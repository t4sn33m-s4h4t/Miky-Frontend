
"use client"
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../../Store/Store'
import { User } from '../../../types'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BASE_API_URL } from '../../../server'
import { handleAuthRequest } from '../utils/apiRequest'
import { Loader } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const RightSidebar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const [suggestedUsers, setSuggestedUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    useEffect(() => {
        const getSuggestedUser = async () => {
            const getSuggestedUserReq = async () => await axios.get(`${BASE_API_URL}/users/suggested-user`, { withCredentials: true })
            const result = await handleAuthRequest(getSuggestedUserReq, setIsLoading);
            if (result) setSuggestedUsers(result.data.data.users)

        }
        getSuggestedUser()
    }, [])

    if (isLoading) {
        return <div className='w-full h-screen flex items-center  justify-center flex-col'>
            <Loader className='animate-spin' />
        </div>
    }
    return (
        <div className='w-1/4 overflow-y-auto lg:py-10 py-6 px-3 lg:px-6 border-l-2 h-full border-secondary-100 fixed'> 
            <div className='flex items-center  justify-between '>
                <div className="flex items-center space-x-4">
                    <Avatar  onClick={()=>router.push(`/profile/${user?._id}`)} className='cursor-pointer w-9 h-9'>
                        <AvatarImage src={user?.profilePicture} className='h-full w-full rounded-full' />
                        <AvatarFallback
                            className='bg-primary-350 text-secondary-100'
                        >
                            {user?.username[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1  onClick={()=>router.push(`/profile/${user?._id}`)} className='cursor-pointer inline font-bold'>{user?.username}</h1>
                        <p className='text-secondary-500 text-sm lg:w-[160px]'>{user?.bio || "I and my owner love to scroll!"}</p>
                    </div>
                </div>
                <h1 className='font-medium text-primary-550 cursor-pointer  hover:underline'>
                    Switch
                </h1>
            </div>
            <div className='flex items-center justify-between mt-5 mb-2 border-b-2 pb-2 border-b-secondary-300'>
                <h1 className='font-semibold text-primary-650 '>Suggested Pets</h1>
                <h1 className='font-medium text-primary-650 cursor-pointer hover:underline'>See All</h1>
            </div>
            {suggestedUsers?.slice(0, 5).map((s_user) => {
                return <div onClick={()=>router.push(`/profile/${s_user._id}`)} key={s_user._id} className='mt-6 border-b pb-2 border-secondary-100 cursor-pointer'>
                    <div className='flex items-center gap-2 justify-between '>
                        <div className="flex items-center cursor-pointer space-x-4">
                            <Avatar className='w-9 h-9'>
                                <AvatarImage src={s_user?.profilePicture} className='h-full w-full rounded-full' />
                                <AvatarFallback
                                    className='bg-primary-350 text-secondary-100'
                                >
                                    {s_user?.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className='font-bold'>{s_user?.username}</h1>
                                <p className='lg:w-[160px] text-sm text-secondary-500'>{s_user?.bio || "I and my owner love to scroll!"}</p>
                            </div>
                        </div>
                        <h1 className='font-medium text-primary-550 cursor-pointer hover:underline '>Details</h1>
                    </div>
                </div>
            })}
        </div>
    )
}

export default RightSidebar
