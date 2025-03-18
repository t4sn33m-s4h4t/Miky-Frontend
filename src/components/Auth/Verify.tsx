"use client";
import { Loader, MailCheck } from "lucide-react";
import React, { useRef, useState, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { LoadingButton } from "../Helper/LoadinButton";
import axios from "axios";
import { BASE_API_URL } from "../../../server";
import { handleAuthRequest } from "../utils/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setAuthUser } from "../../../Store/AuthSlice";
import { useRouter } from "next/navigation";
import { RootState } from "../../../Store/Store";

const Verify = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector((state: RootState) => state?.auth.user); 
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true)


  useEffect(()=>{
    if(!user){
      router.replace('/auth/login')
    }
    else if(user && user.isVerified){
      router.replace('/')
    }else{
      setIsPageLoading(false);
    }
  },[user, router])


  const [otp, setOTP] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    if (/^\d$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      if (index < otp.length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOTP = [...otp];
      newOTP[index] = "";
      setOTP(newOTP);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmit = async () => {
    const otpValue = otp.join("");

    const verifyReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/verify`,
        { otp: otpValue },
        { withCredentials: true }
      );
    };

    const result = await handleAuthRequest(verifyReq, setIsLoading);

    if (result?.data) {
      dispatch(setAuthUser(result.data.user));
      toast.success(result.data.message);
      router.push('/')
    }
  };

  const handleResendOtp = async () => {
    try {
      const resend0tpReq = async () => await axios.post(`${BASE_API_URL}/users/resend-otp`, null, {
        withCredentials: true,
      });

      const result = await handleAuthRequest(resend0tpReq, setIsLoading);

      if (result) {
        toast.success(result.data.message);
      }
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
      console.error(error);
    }
  };
if (isPageLoading) {
  return(
    <div className="h-screen flex justify-center items-center">
      <Loader className="w-20 h-20 animate-spin" />
    </div>
  )
}

  return (
    <div className="h-screen flex items-center flex-col justify-center">
      <MailCheck className="w-20 h-20 sm:w-32 sm:h-32 text-primary-450" />
      <h1 className="text-primary-400 text-2xl sm:text-3xl font-bold mb-3">OTP Verification</h1>
      <p className="mb-6 text-sm sm:text-base text-secondary-600 font-medium">
          We have sent a code to <b className="text-primary-500 font-extrabold">{user?.email}</b>
      </p>
      <div className="flex space-x-2 md:space-x-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="sm:w-20 sm:h-20 w-10 h-10 rounded-lg bg-secondary-100 text-lg sm:text-3xl font-bold outline-primary-200 text-center no-spinner text-primary-550"
          />
        ))}
      </div>
      <div className="flex items-center mt-4 space-x-2">
        <h1 className="text-sm sm:text-lg font-medium text-primary-500">
          Didn&apos;t get the OTP code?
        </h1>
        <button
          onClick={handleResendOtp}
          className="text-sm sm:text-lg font-medium text-primary-300 underline cursor-pointer">
          Resend Code
        </button>
      </div>
      <LoadingButton
        onClick={handleSubmit}
        type="submit"
        isLoading={isLoading}
        className="mt-6 w-52 bg-primary-200 text-primary-650 hover:bg-primary-150 hover:text-secondary-700 cursor-pointer"
      >
        Verify
      </LoadingButton>
    </div>
  );
};

export default Verify;
