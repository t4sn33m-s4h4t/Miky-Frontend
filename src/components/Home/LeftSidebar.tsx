"use client"
import { Heart, HomeIcon, LogOutIcon, MessageCircle, Search, SquarePlus } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../Store/Store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BASE_API_URL } from '../../../server'
import axios from 'axios'
import { setAuthUser } from '../../../Store/AuthSlice'
import { toast } from 'sonner'
import CreatePostModel from './CreatePostModel'

const LeftSidebar = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    
        const [isDialouge, setIsDialougeOpen] = useState(false);
      const router = useRouter()
    const dispathc = useDispatch()
      const handleLogOut = async()=>{
        await axios.post(`${BASE_API_URL}/users/logout`, {}, {withCredentials: true})
        dispathc(setAuthUser(null));
        toast.success("Logged Out Successfully")
        router.push('/auth/login')
      }
    
      const handleSidebar = (label: string) => {
        if (label === "Home") router.push("/")
        if (label === "Logout") handleLogOut();
        if (label === "Create") setIsDialougeOpen(true);
        if (label === "Profile") router.push(`/profile/${user?._id}`)
      }

    const sidebarListArray = [
        {
            icon: <HomeIcon />,
            label: "Home"
        },
        {
            icon: <Search />,
            label: "Search"
        },
        {
            icon: <MessageCircle />,
            label: "Message"
        },
        {
            icon: <Heart />,
            label: "Notifications"
        },
        {
            icon: <SquarePlus />,
            label: "Create"
        },
        {
            icon: (
                <Avatar className='w-9 h-9 '>
                    <AvatarImage src={user?.profilePicture} className='h-full w-full' />
                    <AvatarFallback className='bg-primary-350 text-secondary-100'>{user?.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            ),
            label: "Profile"
        },
        {
            icon: <LogOutIcon />,
            label: "Logout"
        },
    ]
    return (
        <div className='h-full  bg-white'>
            <CreatePostModel isOpen={isDialouge} onClose={()=>setIsDialougeOpen(false)} />
            <div  className='lg:p-6 p-3 '>
            <div>
                <Image
                    src="/images/logo.png"
                    alt="logo"
                    width={100}
                    height={100}
                    onClick={() => router.push("/")}
                    className='mx-auto cursor-pointer' >

                </Image>
            </div>
            <div className="mt-6 ">

                {
                    sidebarListArray.map((link) => {
                        return (
                            <div onClick={()=>handleSidebar(link.label)} className='flex items-center mb-2 p-3 rounded-lg group cursor-pointer transition-all duration-200 hover:bg-primary-200 hover:text-primary-650 space-x-2' key={link.label}>
                                <div className="group-hover:scale-110 transition-all duration-200 text-secondary-700">
                                    {link.icon}
                                </div>
                                <p className="lg:text-lg text-base">
                                    {
                                        link.label
                                    }
                                </p>
                            </div>
                        )
                    })

                }
            </div>
            </div>
        </div>
    )
}

export default LeftSidebar
