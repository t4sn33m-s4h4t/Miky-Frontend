"use client";
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/Store';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import LeftSidebar from '@/components/Home/LeftSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { LoadingButton } from '@/components/Helper/LoadinButton';
import { PasswordInput } from '@/components/Auth/PasswordInput';
import { BASE_API_URL } from '../../../server';
import { handleAuthRequest } from '@/components/utils/apiRequest';
import { setAuthUser } from '../../../Store/AuthSlice';
import { toast } from 'sonner';
import axios from 'axios';

const EditProfilePage = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state: RootState) => state?.auth.user);
    const [selectedImage, setSelectedImage] = useState<string | null>(user?.profilePicture || null);
    const [username, setUsername] = useState(user?.username || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newConfirmPassword, setnewConfirmPassword] = useState("")
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingUsername, setIsLoadingUsername] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result as string)
            reader.readAsDataURL(file);
        }
    }

    const handleUpdateProfile = async () => {
        const trimmedBio = bio.trim();
        const formData = new FormData();
        formData.append("bio", trimmedBio);
    
        if (fileInputRef.current?.files[0]) {
            formData.append("profilePicture", fileInputRef.current.files[0]);
        }
        const updateProfileReq = async () => await axios.post(`${BASE_API_URL}/users/edit-profile`, formData, { withCredentials: true });
        const result = await handleAuthRequest(updateProfileReq, setIsLoadingProfile);
    
        if (result) {
            dispatch(setAuthUser(result.data.data));
            setBio(result.data.data.bio); 
            toast.success(result.data.message);
        }
    };
    

    const handleUpdateUsername = async () => {
        if (!username) {
            return toast.error("Username is required");
        }


        const updateUsernameReq = async () => await axios.post(
            `${BASE_API_URL}/users/edit-profile`,
            { username },
            { withCredentials: true }
        );
        const result = await handleAuthRequest(updateUsernameReq, setIsLoadingUsername)

        if (result) {
            dispatch(setAuthUser(result.data.data));
            toast.success(result.data.message);
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !newConfirmPassword) {
            return toast.error("All fields are required");
        }

        if (newPassword !== newConfirmPassword) {
            return toast.error("New passwords do not match");
        }

        setIsLoadingPassword(true);

        const response = async () => await axios.post(
            `${BASE_API_URL}/users/change-password`,
            {
                oldPassword: currentPassword,
                newPassword,
                newConfirmPassword,
            },
            { withCredentials: true }
        );
        const result = await handleAuthRequest(response, setIsLoadingPassword)

        if (result) {
            toast.success(result.data.message);
            setCurrentPassword("");
            setNewPassword("");
            setnewConfirmPassword("");
        }
    };
 
    useEffect(() => {
        if (!user) {
            return router.push('/auth/login')
        }

        if (user) {
            setUsername(user.username || '');
            setBio(user.bio || '');
            setSelectedImage(user.profilePicture || null);
        }
    }, [user, router]);
    
    return (
        <div className='flex pb-20'>
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
                <div className="mx-auto w-[80%]">
                    <div className="mt-16 pb-16 border-secondary-300 border-b-2 ">
                        <div className="flex items-center justify-center">
                            <Avatar
                                onClick={handleAvatarClick}
                                className=' h-[10rem] w-[10rem] cursor-pointer hover:scale-95 transition-all duration-200 '>
                                <AvatarImage src={selectedImage || ''} className='h-full w-full rounded-full' />
                                <AvatarFallback
                                    className='bg-primary-350 text-7xl text-secondary-100'
                                >
                                    {user?.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <input type="file" accept='image/*' className='hidden' ref={fileInputRef} onChange={handleFileChange} />

                        <div className="flex items-center justify-center">
                            <LoadingButton isLoading={isLoadingProfile} className='bg-primary-200 text-primary-500 hover:bg-primary-150 hover:text-secondary-500 mt-4'
                                onClick={handleUpdateProfile}>
                                Change Photo
                            </LoadingButton>
                        </div>
                    </div>
                    <div className='mt-10 border-b-2 border-secondary-300 pb-10'>
                        <label htmlFor="username" className='block text-lg font-bold mb-2 '>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            placeholder='Your Username Here...'
                            onChange={(e) => setUsername(e.target.value)}
                            className='w-full h-[3rem] bg-secondary-100 outline-none p-6 rounded-md text-primary-550'
                        />
                        <LoadingButton isLoading={isLoadingUsername} className='bg-primary-200 text-primary-500 hover:bg-primary-150 hover:text-secondary-500 mt-6'
                            onClick={handleUpdateUsername}>
                            Update Username
                        </LoadingButton>
                    </div>
                    <div className='mt-10 border-b-2 border-secondary-300 pb-10'>
                        <label htmlFor="bio" className='block text-lg font-bold mb-2 '>
                            Bio
                        </label>
                        <textarea maxLength={32} value={bio} placeholder='Your Bio Here...' onChange={(e) => setBio(e.target.value)} className='w-full h-[7rem] bg-secondary-100 outline-none p-6 rounded-md text-primary-550'></textarea>
                        <LoadingButton isLoading={isLoadingProfile} className='bg-primary-200 text-primary-500 hover:bg-primary-150 hover:text-secondary-500 mt-6'
                            onClick={handleUpdateProfile}>
                            Change Bio
                        </LoadingButton>
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold mt-6'>Change Password</h1>
                        <form className='mt-8 mb-8' onSubmit={handlePasswordChange}>
                            <div className="w-[90%] md:w-[80%] lg:w-[60%] ">
                                <PasswordInput name='currentpassword'
                                    value={currentPassword}
                                    label='Current Password'
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="w-[90%] md:w-[80%] lg:w-[60%] my-4">
                                <PasswordInput name='newpassword'
                                    value={newPassword}
                                    label='New Password'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="w-[90%] md:w-[80%] my-4 lg:w-[60%] ">
                                <PasswordInput name='confirmnewpassword'
                                    value={newConfirmPassword}
                                    label='Confirm New Password'
                                    onChange={(e) => setnewConfirmPassword(e.target.value)}
                                />
                            </div>
                            <div className='mt-2'>
                                <LoadingButton type='submit' isLoading={isLoadingPassword} className='bg-primary-200 text-primary-500 hover:bg-primary-150 hover:text-secondary-500 mt-6'>
                                    Change Password
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage