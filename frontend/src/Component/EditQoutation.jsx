
import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  User,
  Briefcase,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { InvoiceContext } from "../Context/InvoiceContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InvoiceFormSkeleton from "./InvoiceFormSkeleton";

const EditQoutation = () => {

  const{backendUrl, getCookie, navigate}=useContext(InvoiceContext)
  const[loading, setLoading]=useState(false)
  const [quotation, setQuotation] = useState({
    quotationNumber: "",
    issueDate: "",
    validUntil: "",

    client: {
      name: "",
     
      email: "",
      phone: "",
      address: "",
    },

    billing: "Monthly",

    services: [
       {
    title: "",
    deliverables: [""],
    no: 1,
    price: "",
  },
    ],

    terms: [""],
  });
 const token=getCookie("token")
  const location=useLocation()

  const getQoutation=async()=>{
try{
  setLoading(true)
    console.log(location)
    const response=await axios.get(`${backendUrl}/get-qoutation-by-id/${location.state}`, {headers:{token}})
console.log(response.data.Qoutation)
     

    setQuotation({
    quotationNumber:response.data.Qoutation.quotationNumber,
    issueDate: response.data.Qoutation.date,
    validUntil: response.data.Qoutation.validUntil,

    client: {
      name: response.data.Qoutation.client.name,
      company: response.data.Qoutation.client.company,
      email: response.data.Qoutation.client.email,
      phone: response.data.Qoutation.client.phone,
      address: response.data.Qoutation.client.address,
    },

    billing: response.data.Qoutation.billing,

    services:response.data.Qoutation.services  ,

    terms: response.data.Qoutation.terms,
  })
  setLoading(false)
}
catch(e){
  setLoading(false)
    console.log(e.message)
    toast.error(e.message)
}
  }


  useEffect(()=>{
    getQoutation()
  },[])

  // -----------------------------
  // Quotation fields
  // -----------------------------

useEffect(()=>{
    console.log(quotation)
},[quotation])


  const handleQuotationChange = (e) => {
    const { name, value } = e.target;

    setQuotation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Client fields
  // -----------------------------

  const handleClientChange = (e) => {
    const { name, value } = e.target;

    setQuotation((prev) => ({
      ...prev,
      client: {
        ...prev.client,
        [name]: value,
      },
    }));
  };

  // -----------------------------
  // Service fields
  // -----------------------------

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;

    setQuotation((prev) => {
      const services = [...prev.services];

      services[index] = {
        ...services[index],
        [name]: value,
      };

      return {
        ...prev,
        services,
      };
    });
  };

  const addService = () => {
    setQuotation((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        {
          title: "",
          deliverables: [""],
          no: 1,
          price: "",
        },
      ],
    }));
  };

  const removeService = (index) => {
    setQuotation((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // -----------------------------
  // Terms
  // -----------------------------

  const handleTermChange = (index, value) => {
    setQuotation((prev) => {
      const terms = [...prev.terms];

      terms[index] = value;

      return {
        ...prev,
        terms,
      };
    });
  };

  const addTerm = () => {
    setQuotation((prev) => ({
      ...prev,
      terms: [...prev.terms, ""],
    }));
  };

  const removeTerm = (index) => {
    setQuotation((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };


const handleDescriptionChange = (serviceIndex, descriptionIndex, value) => {
  setQuotation((prev) => {
    const services = [...prev.services];

    const descriptions = [...services[serviceIndex]?.deliverables];

    descriptions[descriptionIndex] = value;

    services[serviceIndex] = {
      ...services[serviceIndex],
      deliverables: descriptions,
    };

    return {
      ...prev,
      services,
    };
  });
};

const addDescription = (serviceIndex) => {
  setQuotation((prev) => {
    const services = [...prev.services];

    services[serviceIndex] = {
      ...services[serviceIndex],
      description: [
        ...services[serviceIndex].description,
        "",
      ],
    };

    return {
      ...prev,
      services,
    };
  });
};

const removeDescription = (serviceIndex, descriptionIndex) => {
  setQuotation((prev) => {
    const services = [...prev.services];

    const descriptions = services[serviceIndex].description.filter(
      (_, index) => index !== descriptionIndex
    );

    services[serviceIndex] = {
      ...services[serviceIndex],
      description:
        descriptions.length > 0 ? descriptions : [""],
    };

    return {
      ...prev,
      services,
    };
  });
};



  // -----------------------------
  // Total
  // -----------------------------

  const total = quotation.services.reduce((sum, service) => {
    const quantity = Number(service.no || 0);
    const price = Number(service.price || 0);

    return sum + quantity * price;
  }, 0);

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = async(e) => {
    try{
      setLoading(true)
    e.preventDefault();

    const finalData = {
      ...quotation,
      total,
      terms: quotation.terms.filter((term) => term.trim() !== ""),
    };

    const response= await axios.post(`${backendUrl}/update-qoutation-by-id/${location.state}`,{"data":finalData},{headers:{token}})
    console.log(response)
    console.log("QUOTATION DATA:", finalData);
    if(response.data.success == true )
    {
      toast.success(" Invoice Edited Successfully ")
      navigate('/allqoutation')
    }
  }
  catch(e){
    setLoading(false)
    console.log(e.message)
    toast.error(e.message)
  }

    
  };

  return (

    loading ? 
    (<InvoiceFormSkeleton/>)
  
  :(
      <div className="min-h-screen bg-[#f7f7f8] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Quotation
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Create a professional quotation for your client
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* -------------------------------- */}
          {/* QUOTATION INFORMATION */}
          {/* -------------------------------- */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <FileText size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Quotation Information
                </h2>

                <p className="text-xs text-gray-500">
                  Basic quotation details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* Quotation Number */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Quotation Number
                </label>

                <input
                  type="text"
                  name="quotationNumber"
                  value={quotation.quotationNumber}
                  onChange={handleQuotationChange}
                  placeholder="QT-2026-001"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Issue Date
                </label>

                <div className="relative">
                  <Calendar
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="issueDate"
                    value={quotation.issueDate}
                    onChange={handleQuotationChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Valid Until
                </label>

                <div className="relative">
                  <Calendar
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="date"
                    name="validUntil"
                    value={quotation.validUntil}
                    onChange={handleQuotationChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

            </div>
          </section>

          {/* -------------------------------- */}
          {/* CLIENT INFORMATION */}
          {/* -------------------------------- */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <User size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Client Information
                </h2>

                <p className="text-xs text-gray-500">
                  Enter your client's details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Client Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={quotation.client.name}
                  onChange={handleClientChange}
                  placeholder="Enter client name"
                  required
                  className="form-input"
                />
              </div>

             

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={quotation.client.email}
                  onChange={handleClientChange}
                  placeholder="client@example.com"
                  className="form-input"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={quotation.client.phone}
                  onChange={handleClientChange}
                  placeholder="+91 9876543210"
                  className="form-input"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={quotation.client.address}
                  onChange={handleClientChange}
                  placeholder="Enter complete client address"
                  rows={3}
                  className="form-input resize-none"
                />
              </div>

            </div>
          </section>

          {/* -------------------------------- */}
          {/* BILLING */}
          {/* -------------------------------- */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Briefcase size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Billing
                </h2>

                <p className="text-xs text-gray-500">
                  Select billing type
                </p>
              </div>
            </div>

            <select
              name="billing"
              value={quotation.billing}
              onChange={handleQuotationChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 md:w-[300px]"
            >
              <option value="Monthly">Monthly</option>
              <option value="One-time">One-time</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>

          </section>

          {/* -------------------------------- */}
          {/* SERVICES */}
          {/* -------------------------------- */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <Briefcase size={18} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Services
                  </h2>

                  <p className="text-xs text-gray-500">
                    Add services included in this quotation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addService}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                <Plus size={17} />
                Add Service
              </button>

            </div>

            <div className="space-y-5">

              {quotation.services.map((service, index) => (

                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >

                  <div className="mb-4 flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-gray-800">
                      Service {index + 1}
                    </h3>

                    {quotation.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(index)}
                        className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    )}

                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-12">

                    {/* Service title */}
                    <div className="md:col-span-4">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Service Name
                      </label>

                      <input
                        type="text"
                        name="title"
                        value={service.title}
                        onChange={(e) =>
                          handleServiceChange(index, e)
                        }
                        placeholder="Social Media Handling"
                        required
                        className="form-input"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-4">
  <div className="mb-2 flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700">
      Description / Deliverables
    </label>

    <button
      type="button"
      onClick={() => addDescription(index)}
      className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
    >
      <Plus size={14} />
      Add
    </button>
  </div>

  <div className="space-y-2">
    {service.deliverables.map((description, descriptionIndex) => (
      <div
        key={descriptionIndex}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={description}
          onChange={(e) =>
            handleDescriptionChange(
              index,
              descriptionIndex,
              e.target.value
            )
          }
          placeholder="Enter deliverable"
          className="form-input"
        />

        {service.deliverables.length > 1 && (
          <button
            type="button"
            onClick={() =>
              removeDescription(index, descriptionIndex)
            }
            className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    ))}
  </div>
</div>
                    {/* Quantity */}
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        name="quantity"
                        value={service.no}
                        onChange={(e) =>
                          handleServiceChange(index, e)
                        }
                        className="form-input"
                      />
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Price
                      </label>

                      <div className="relative">
                        <IndianRupee
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="number"
                          min="0"
                          name="price"
                          value={service.price}
                          onChange={(e) =>
                            handleServiceChange(index, e)
                          }
                          placeholder="5000"
                          required
                          className="form-input pl-9"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Service total */}
                  <div className="mt-4 flex justify-end">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Service Total
                      </p>

                      <p className="text-lg font-bold text-gray-900">
                        ₹
                        {(
                          Number(service.no || 0) *
                          Number(service.price || 0)
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                </div>

              ))}

            </div>

            {/* Grand Total */}

            <div className="mt-6 flex justify-end">

              <div className="w-full rounded-xl bg-violet-50 p-5 sm:w-[320px]">

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-violet-700">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* -------------------------------- */}
          {/* TERMS */}
          {/* -------------------------------- */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">

              <div>
                <h2 className="font-semibold text-gray-900">
                  Terms & Conditions
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Add terms for this quotation
                </p>
              </div>

              <button
                type="button"
                onClick={addTerm}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                <Plus size={15} />
                Add Term
              </button>

            </div>

            <div className="space-y-3">

              {quotation.terms.map((term, index) => (

                <div
                  key={index}
                  className="flex items-center gap-3"
                >

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500">
                    {index + 1}
                  </span>

                  <input
                    type="text"
                    value={term}
                    onChange={(e) =>
                      handleTermChange(index, e.target.value)
                    }
                    placeholder="Enter quotation term"
                    className="form-input"
                  />

                  {quotation.terms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTerm(index)}
                      className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                </div>

              ))}

            </div>

          </section>

          {/* -------------------------------- */}
          {/* SUBMIT */}
          {/* -------------------------------- */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          
            <button
              type="submit"
              className=" cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <FileText size={17} />
              Edit Quotation
            </button>

          </div>

        </form>
      </div>

      {/* Reusable input styles */}
      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  )
  );
};

export default EditQoutation;
