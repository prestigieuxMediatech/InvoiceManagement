import { React,createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const InvoiceContext=createContext()

const InvoiceContextProvider=(props)=>{
    const backendUrl='http://localhost:3000/api'
    
//set cookies 
const setCookie=(name,value)=>{
 document.cookie=`${name}=${value}; path=/`
}

//get cookies
  const getCookie = (name) => {
  const cookies = document.cookie.split("; ");

  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return value;
    }
  }

  return null;
};

  const navigate=useNavigate()

// delete cookies
 const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`;
  };

// whatsapp loading 
const[wLoading,setWLoading]=useState(false)

    const value={
      wLoading, setWLoading,
        backendUrl,
        setCookie,
        deleteCookie,
        getCookie,
        navigate
    }

return(
    <InvoiceContext.Provider value={value}>
        {props.children}
    </InvoiceContext.Provider>
)
}

export default InvoiceContextProvider;