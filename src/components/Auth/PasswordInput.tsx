
"use client"
import { ChangeEvent, useState } from 'react'; 
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps  {
  label?: string;
  name: string; 
  placeholder?: string;
  value?:string;
  onChange?:(e:ChangeEvent<HTMLInputElement>)=>void;
  inputClassName?: string;
  labelClassName?: string;
  iconClassName?: string;
}

export const PasswordInput = ({ label, name, placeholder="Enter Password", value, onChange, inputClassName='', labelClassName='', iconClassName=''}: PasswordInputProps) => {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisiblity = ()=>{
    setShowPassword(!showPassword)
  }
  return ( 
    <>
    {
      label && <label className={`font-semibold mb-2 block ${labelClassName} `}>{label}</label>
    }
      
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          className={`px-4 py-3 bg-secondary-100 rounded-lg w-full block outline-none ${inputClassName}  `}
        />
        <button
          type="button"
          onClick={togglePasswordVisiblity}
          className={`absolute outline-none cursor-pointer right-3 top-3 p-0 text-primary-550  hover:text-primary-600 ${iconClassName}`}
        >
          {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div> 
    </>
  );
};