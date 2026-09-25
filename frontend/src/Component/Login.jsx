
import { InvoiceContext } from "../Context/InvoiceContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { toast } from "react-toastify";

const Login = () => {

const[userName,setUserName]=useState('')
const[password, setPassword]=useState('')
const[loading, setLoading]=useState(false)
const {backendUrl, setCookie, getCookie, navigate}=useContext(InvoiceContext)


useEffect(()=>{
let token=getCookie('token')
if(token){
  navigate('/home')
}
},[])



const handleSubmit= async(e)=>{



  try{
  
        e.preventDefault()
          setLoading(true)
       const response=await axios.post(`${backendUrl}/login`,{userName,password})
       setCookie("token",response.data.token)
       
       toast.success("login successfully ")
       setLoading(false)
       navigate('/home')


  }
  catch(e){
    console.log(e.message)
    toast.error(e.message)
  }
}





  return (
    <div className="min-h-screen bg-violet-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl shadow-violet-100 lg:grid-cols-2">

          {/* Left Section */}
          <div className="hidden bg-violet-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            
            {/* Logo */}
            
                       <div className="flex h-36 w-36 items-center justify-center">
                         <img
                           src="./White Logo.png"
                           alt="Company Logo"
                           className="h-full w-full object-contain"
                         />
                       </div>
           
                    
            {/* Content */}
            <div className="max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
                Welcome Back
              </p>

              <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
                Manage your invoices with ease.
              </h1>

              <p className="mt-6 text-base leading-7 text-violet-100">
                Create professional invoices, manage your clients and keep
                your business organized from one simple dashboard.
              </p>

              {/* Feature */}
              <div className="mt-8 space-y-4">
                {[
                  "Create professional invoices",
                  "Manage all your invoices",
                  "Keep your business organized",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-violet-100"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-violet-700">
                      ✓
                    </div>

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-violet-200">
              © 2026 YourBrand. All rights reserved.
            </p>
          </div>

          {/* Login Section */}
          <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                 <div className="flex h-40 w-40 ml10 items-center justify-center">
                         <img
                           src="./BlackLogo.png"
                           alt="Company Logo"
                           className="h-full w-full object-contain"
                         />
                       </div>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-violet-950 sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Login to your account to continue.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={(e)=>{handleSubmit(e)}} className="space-y-5">

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Username
                  </label>

                  <input
                    type="text"
                    onChange={(e)=>{
                      setUserName(e.target.value)
                    }}

                    value={userName}
                    placeholder="Enter your username"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-violet-100
                      bg-white
                      px-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-violet-600
                      focus:ring-4
                      focus:ring-violet-100
                    "
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                  onChange={(e)=>{setPassword(e.target.value)}}
                  value={password}
                    type="password"
                    placeholder="Enter your password"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-violet-100
                      bg-white
                      px-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-violet-600
                      focus:ring-4
                      focus:ring-violet-100
                    "
                  />
                </div>

            

                {/* Login Button */}
                <button
                  type="submit"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    bg-violet-700
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-violet-800
                    active:scale-[0.99]
                  "
                >

                 { loading ? "Loading........" :"Loging"}
                </button>
              </form>

             

             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
