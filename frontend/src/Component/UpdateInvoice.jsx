import React, { useContext, useEffect, useState } from "react";
import {
  FileText,
  CalendarDays,
  Clock3,
  Building2,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Save,
} from "lucide-react";
import { InvoiceContext } from "../Context/InvoiceContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateInvoice = () => {
  const {backendUrl, getCookie, navigate}=useContext(InvoiceContext)
  const location=useLocation()
  const [invoice, setInvoice] = useState({
    invoiceNumber: "INV-2026-001",
    date: "2026-09-16",
    dueDate: "2026-09-30",

    CbusinessName: "Flyera",
    Cemail: "russell@flyera.com",
    Cphone: "+91 98765 43210",
    Caddress: "Mumbai, Maharashtra, India",
  });

  const handleChange = (e) => {
    setInvoice({
      ...invoice,
      [e.target.name]: e.target.value,
    });
  };


  useEffect(()=>{
    const getInvoice=async()=>{
      try{
        const token=getCookie('token')
        const response =await axios(`${backendUrl}/invoice?id=${location.state}`,{headers:{token}} )
        console.log(response.data.data)
        setInvoice({
    invoiceNumber:response.data.data.invoiceNumber ,
    date: response.data.data.date,
    dueDate: response.data.data.dueDate,

    CbusinessName: response.data.data.CbusinessName,
    Cemail: response.data.data.Cemail,
    Cphone: response.data.data.Cphone,
    Caddress:response.data.data.Caddress,
  })


      }
      catch(e){
        console.log(e.message)
      }
    }

    getInvoice()
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    console.log("Updated Invoice:", invoice);

    try{
      let token=getCookie('token')
    const response=await axios.put(`${backendUrl}/updateinvoice/${location.state}`,
      {
        "invoiceNumber":invoice.invoiceNumber,
        "date":invoice.date,
        "dueDate":invoice.dueDate,
        "CbusinessName":invoice.CbusinessName,
        "Cemail":invoice.Cemail,
        "Cphone":invoice.Cphone,
        "Caddress":invoice.Caddress
      },
    {headers:{token}}
    )

        console.log(response)
      if(response.data.success == true){
        toast.success("updated success full")
        navigate('/home')
        
      }
    }
    catch(e){
      toast.error(e.message)
      console.log(e.message)
    }
  };




  return (
    <div className="min-h-screen bg-[#faf9ff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <button
            type="button"
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-600"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                  <FileText size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                    Invoice Management
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Update Invoice
                  </h1>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Update invoice details and client information.
              </p>
            </div>

            {/* Invoice Number Badge */}
            <div className="w-fit rounded-xl border border-violet-100 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Invoice
              </p>

              <p className="mt-0.5 text-sm font-bold text-violet-600">
                {invoice.invoiceNumber}
              </p>
            </div>

          </div>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ================= INVOICE DETAILS ================= */}
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(124,58,237,0.06)]">

            {/* Section Header */}
            <div className="border-b border-violet-50 bg-gradient-to-r from-violet-50/70 to-white px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Invoice Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Basic information about this invoice
                  </p>
                </div>

              </div>
            </div>


            {/* Fields */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">

              {/* Invoice Number */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <FileText size={14} className="text-violet-500" />
                  Invoice Number
                </label>

                <input
                  type="text"
                  name="invoiceNumber"
                  value={invoice.invoiceNumber}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>


              {/* Invoice Date */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <CalendarDays size={14} className="text-violet-500" />
                  Invoice Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={invoice.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>


              {/* Due Date */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Clock3 size={14} className="text-violet-500" />
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={invoice.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>

            </div>
          </div>


          {/* ================= CLIENT INFORMATION ================= */}
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(124,58,237,0.06)]">

            {/* Section Header */}
            <div className="border-b border-violet-50 bg-gradient-to-r from-violet-50/70 to-white px-6 py-5">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Building2 size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Client Information
                  </h2>

                  <p className="text-xs text-gray-500">
                    Contact details of your client
                  </p>
                </div>

              </div>
            </div>


            <div className="space-y-5 p-6">

              {/* Business Name */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Building2 size={14} className="text-violet-500" />
                  Business Name
                </label>

                <input
                  type="text"
                  name="CbusinessName"
                  value={invoice.CbusinessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>


              {/* Email + Phone */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                {/* Email */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Mail size={14} className="text-violet-500" />
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="Cemail"
                    value={invoice.Cemail}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                  />
                </div>


                {/* Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                    <Phone size={14} className="text-violet-500" />
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="Cphone"
                    value={invoice.Cphone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                  />
                </div>

              </div>


              {/* Address */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <MapPin size={14} className="text-violet-500" />
                  Address
                </label>

                <textarea
                  name="Caddress"
                  value={invoice.Caddress}
                  onChange={handleChange}
                  placeholder="Enter client address"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />
              </div>

            </div>
          </div>


          {/* ================= ACTIONS ================= */}
          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_30px_rgba(124,58,237,0.05)] sm:flex-row sm:justify-end">

            <button
              type="button"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-violet-300"
            >
              <Save size={17} />
              Save Changes
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateInvoice;