"use client";
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from "../../../Store/Store";
import { useRouter } from 'next/navigation';
import { User } from '../../../types';
import axios from 'axios';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '../utils/apiRequest';
import { BookMarked, Grid, Loader, MenuIcon } from 'lucide-react';
import LeftSidebar from '../Home/LeftSidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import Posts from './Posts';
import Saved from './Saved';
import { useFollowUnfollow } from '../hooks/useAuth';
type Props = {
    id: string
}

const Profile = ({ id }: Props) => {
    const { handleFollowUnfollow } = useFollowUnfollow()
    const user = useSelector((state: RootState) => state?.auth.user);
    const [postOrSave, setPostOrSave] = useState<string>("POST");
    const router = useRouter()
    const [userProfile, setUserProfile] = useState<User>();
    const isOwnProfile = user?._id === id;
    const isFollowing = user?.following.includes(id)


    useEffect(() => {
        if (!user) {
            return router.push('/auth/login')
        }

        const getUser = async () => {
            const getUserReq = async () => await axios.get(`${BASE_API_URL}/users/profile/${id}`)
            const result = await handleAuthRequest(getUserReq)

            if (result) {
                setUserProfile(result?.data.data)
            }
        }
        getUser()
    }, [user, router, id])
 
    return (
 
            <div className='flex mb-20'>
                <div className="hidden md:block border-r-2 border-secondary-100 h-screen fixed w-[20%]">
                    <LeftSidebar />
                </div>
                <div className="flex-1 md:ml-[20%] overflow-y-auto">
                    <div className="block md:hidden p-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button aria-label="Open Menu" className="cursor-pointer">
                                    <MenuIcon />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-4  bg-white">
                                <SheetTitle></SheetTitle>
                                <LeftSidebar />
                            </SheetContent>
                        </Sheet>
                    </div>
                    <div className='w-[90%] sm:w-[80%] mx-auto '>
                        {/* Top Profile  */}
                        <div className='mt-16 flex md:flex-row flex-col md:items-center pb-16 border-b-2 border-secondary-100 md:space-x-20'>
                            <Avatar className='h-[10rem] w-[10rem] mb-8 md:mb-0'>
                                <AvatarImage src={userProfile?.profilePicture} className='h-full w-full rounded-full' />
                                <AvatarFallback
                                    className='bg-primary-350 text-7xl text-secondary-100'
                                >
                                    {userProfile?.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className='flex items-center space-x-8'>
                                    <h1 className='text-2xl font-bold'>{userProfile?.username} <span>{userProfile?.isAdmin && "(Admin)"  }</span></h1>
                                    {
                                        isOwnProfile && <Link href={"/edit-profile"}>
                                            <Button className='bg-secondary-200 text-primary-650 hover:text-secondary-700 hover:bg-secondary-100 '>
                                                Edit Profile
                                            </Button>
                                        </Link>
                                    }
                                    {
                                        !isOwnProfile && (
                                            <Button onClick={() => handleFollowUnfollow(id)} className={`text-primary-650 ${isFollowing ? "bg-secondary-200/40" : "bg-secondary-200"} `}  >
                                                {isFollowing ? "Following" : "Follow"}
                                            </Button>

                                        )
                                    }
                                </div>
                                <div className="flex items-center space-x-8 mt-6 mb-6 ">
                                    <div>
                                        <span className='font-bold'>
                                            {userProfile?.posts.length}
                                        </span>
                                        <span> Post                                     </span>
                                    </div>
                                    <div>
                                        <span className='font-bold'>
                                            {userProfile?.followers.length}
                                        </span>
                                        <span> Followers                                     </span>
                                    </div>
                                    <div>
                                        <span className='font-bold'>
                                            {userProfile?.following.length}
                                        </span>
                                        <span> Following                                     </span>
                                    </div>
                                </div>
                                <p className='w-[75%] font-medium'>
                                    {userProfile?.bio || "I and my owner love to scroll!"}
                                </p>
                            </div>
                        </div>
                        {/* Bottom Post ans Save  */}
                        <div className="mt-10">
                            <div className='flex items-center justify-center space-x-14'>
                                <div className={cn("flex items-center space-x-2 cursor-pointer", postOrSave === "POST" && "text-secondary-300")}
                                    onClick={() => setPostOrSave("POST")}
                                >
                                    <Grid />
                                    <span className='font-semibold'>Post</span>
                                </div>

                                <div className={cn("flex items-center space-x-2 cursor-pointer", postOrSave === "SAVE" && "text-secondary-300")}
                                    onClick={() => setPostOrSave("SAVE")}
                                >
                                    <BookMarked />
                                    <span className='font-semibold'>Saved</span>
                                </div>
                            </div>
                            {
                                postOrSave === "POST" && <Posts userProfile={userProfile} />
                            }
                            {
                                postOrSave === "SAVE" && <Saved userProfile={userProfile} />
                            }
                        </div>

                    </div>
                </div>
            </div>
     
    )
}

export default Profile
