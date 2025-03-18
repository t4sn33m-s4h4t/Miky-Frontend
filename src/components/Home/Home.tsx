"use client";
import React, { useEffect, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Loader, MenuIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Store/Store";
import axios from "axios";
import { BASE_API_URL } from "../../../server";
import { handleAuthRequest } from "../utils/apiRequest";
import { setAuthUser } from "../../../Store/AuthSlice";

const Home = () => {
  const dispatch = useDispatch();
  const [isLoadin, setIsLoading] = useState(false)
  const user = useSelector((state:RootState)=>state.auth.user)
  useEffect(()=>{
    const getAuthUser = async()=>{
      const getAuthUserReq = async()=>await axios.get(`${BASE_API_URL}/users/me`, {withCredentials:true})
      const result = await handleAuthRequest(getAuthUserReq, setIsLoading)
      if (result) { 
        dispatch(setAuthUser(result?.data?.data?.user))
      }
    }
    getAuthUser()
  },[dispatch])

  useEffect(()=>{
    if (!user) {
      return redirect('/auth/login')
    }
  }, [user])
if (isLoadin) {
  return (
    <div className="h-screen flex justify-center w-full items-center flex-col">
      <Loader className="animate-spin" />
    </div>
  )
}
  return (
    <div className="flex min-h-screen bg-primary-300/10">
      {/* Left Sidebar (Hidden on Mobile) */}
      <div className="hidden md:block border-r-2 border-secondary-100 h-screen fixed w-[20%]">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-[20%] overflow-y-auto">
        {/* Mobile Sidebar Toggle */}
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

        {/* Feed */}
        <Feed />
      </div>

      {/* Right Sidebar (Hidden on Small Screens) */}
      <div className="w-[25%] bg-white lg:block hidden ">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
