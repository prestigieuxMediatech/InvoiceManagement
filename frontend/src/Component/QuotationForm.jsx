import React, { useContext, useState } from "react";

import {
  FileText,
  User,
  Building2,
  CalendarDays,
  BriefcaseBusiness,
  Mail,
  Phone,
  Globe,
  Plus,
  Trash2,
  Save,
  IndianRupee,
  ClipboardList,
  X,
} from "lucide-react";

import { toast } from "react-toastify";
import { InvoiceContext } from "../Context/InvoiceContext";
import axios from "axios";

/* ============================================================
   HELPERS
   ============================================================ */

const generateQuotationNumber = () => {
  return `QT-${Math.floor(1000 + Math.random() * 9000)}`;
};

const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDefaultValidUntil = () => {
  const date = new Date();

  date.setDate(date.getDate() + 30);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/* ============================================================
   FORM SECTION
   ============================================================ */

const FormSection = ({
  icon: Icon,
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <section
      className={`rounded-2xl border border-violet-100 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-sm font-bold text-slate-800">{title}</h2>

          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
};

/* ============================================================
   INPUT FIELD
   ============================================================ */

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  icon: Icon,
  readOnly = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <div className={Icon ? "relative" : ""}>
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full rounded-xl border border-slate-200 py-3 text-sm outline-none transition ${
            Icon ? "pl-9 pr-4" : "px-4"
          } ${
            readOnly
              ? "cursor-not-allowed bg-slate-50 font-semibold text-slate-600"
              : "bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
          }`}
        />
      </div>
    </div>
  );
};

/* ============================================================
   TEXTAREA FIELD
   ============================================================ */

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 3,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
      />
    </div>
  );
};

/* ============================================================
   QUOTATION FORM
   ============================================================ */

const QuotationForm = () => {
  /* ============================================================
     QUOTATION NUMBER
     ============================================================ */

  const [quotationNumber] = useState(generateQuotationNumber);
  const{backendUrl, getCookie, navigate}=useContext(InvoiceContext)
  /* ============================================================
     FORM DATA
     ============================================================ */

  const [formData, setFormData] = useState({
    /* ----------------------------------------------------------
       BUSINESS
       ---------------------------------------------------------- */

    BbusinessName: "PRESTIGIEUX MEDIATECH PVT. LTD",

    Bemail: "info.prestigieux@gmail.com",

    Bphone: "91 9136892346",

    Baddress:
      "Shop No. 6, Plot -21, Sec-09, Ammar Residency CHS, Taloja Phase -1, Panvel Raigad, Pin - 410208",

    /* ----------------------------------------------------------
       CLIENT
       ---------------------------------------------------------- */

    CbusinessName: "",

    Cemail: "",

    Cphone: "",

    Caddress: "",

    /* ----------------------------------------------------------
       QUOTATION
       ---------------------------------------------------------- */

    date: getCurrentDate(),

    validUntil: getDefaultValidUntil(),

    /* ----------------------------------------------------------
       PROJECT
       ---------------------------------------------------------- */

    projectName: "",

    projectDescription: "",

    /* ----------------------------------------------------------
       OTHER
       ---------------------------------------------------------- */

    billing: "Monthly",

    website: "",

    signatureName: "Prestigieux",
  });

  /* ============================================================
     SERVICES

     deliverables IS AN ARRAY
     ============================================================ */

  const [services, setServices] = useState([
    {
      id: Date.now(),
      title: "",
      deliverables: [""],
      price: "",
    },
  ]);

  /* ============================================================
     TERMS
     ============================================================ */

  const [terms, setTerms] = useState([
    "Payment is due according to the agreed billing schedule.",
    "Any additional work outside the agreed scope will be quoted separately.",
    "Project timelines may change based on client feedback and approvals.",
    "Quotation is valid until the specified validity date.",
  ]);

  /* ============================================================
     CREATED QUOTATION

     This stores the final quotation object inside this file.
     ============================================================ */

  const [createdQuotation, setCreatedQuotation] = useState(null);

  /* ============================================================
     LOADING
     ============================================================ */

  const [loading, setLoading] = useState(false);

  /* ============================================================
     HANDLE FORM CHANGE
     ============================================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     SERVICE CHANGE
     ============================================================ */

  const handleServiceChange = (id, field, value) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  };

  /* ============================================================
     ADD SERVICE
     ============================================================ */

  const handleAddService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        title: "",
        deliverables: [""],
        price: "",
      },
    ]);
  };

  /* ============================================================
     REMOVE SERVICE
     ============================================================ */

  const handleRemoveService = (id) => {
    if (services.length === 1) {
      toast.error("At least one service is required");
      return;
    }

    setServices((prev) =>
      prev.filter((service) => service.id !== id)
    );
  };

  /* ============================================================
     DELIVERABLE CHANGE
     ============================================================ */

  const handleDeliverableChange = (
    serviceId,
    deliverableIndex,
    value
  ) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== serviceId) {
          return service;
        }

        const updatedDeliverables = [
          ...service.deliverables,
        ];

        updatedDeliverables[deliverableIndex] = value;

        return {
          ...service,
          deliverables: updatedDeliverables,
        };
      })
    );
  };

  /* ============================================================
     ADD DELIVERABLE
     ============================================================ */

  const handleAddDeliverable = (serviceId) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              deliverables: [
                ...service.deliverables,
                "",
              ],
            }
          : service
      )
    );
  };

  /* ============================================================
     REMOVE DELIVERABLE
     ============================================================ */

  const handleRemoveDeliverable = (
    serviceId,
    deliverableIndex
  ) => {
    setServices((prev) =>
      prev.map((service) => {
        if (service.id !== serviceId) {
          return service;
        }

        if (service.deliverables.length === 1) {
          toast.error(
            "At least one deliverable is required"
          );

          return service;
        }

        return {
          ...service,
          deliverables: service.deliverables.filter(
            (_, index) => index !== deliverableIndex
          ),
        };
      })
    );
  };

  /* ============================================================
     TERM CHANGE
     ============================================================ */

  const handleTermChange = (index, value) => {
    setTerms((prev) =>
      prev.map((term, i) =>
        i === index ? value : term
      )
    );
  };

  /* ============================================================
     ADD TERM
     ============================================================ */

  const handleAddTerm = () => {
    setTerms((prev) => [...prev, ""]);
  };

  /* ============================================================
     REMOVE TERM
     ============================================================ */

  const handleRemoveTerm = (index) => {
    if (terms.length === 1) {
      toast.error("At least one term is required");
      return;
    }

    setTerms((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* ============================================================
     TOTAL
     ============================================================ */

  const total = services.reduce((sum, service) => {
    return sum + (Number(service.price) || 0);
  }, 0);

  /* ============================================================
     MONEY FORMAT
     ============================================================ */

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /* ============================================================
     CREATE QUOTATION
     ============================================================ */

  const handleCreateQuotation = async () => {
    try {
      /* --------------------------------------------------------
         VALIDATION
         -------------------------------------------------------- */

      if (!quotationNumber.trim()) {
        toast.error("Quotation number is missing");
        return;
      }

      if (!formData.BbusinessName.trim()) {
        toast.error("Please enter business name");
        return;
      }

      if (!formData.Bemail.trim()) {
        toast.error("Please enter business email");
        return;
      }

      if (!formData.CbusinessName.trim()) {
        toast.error("Please enter client name");
        return;
      }

      if (!formData.date) {
        toast.error("Please select quotation date");
        return;
      }

      if (!formData.validUntil) {
        toast.error(
          "Please select quotation validity date"
        );
        return;
      }

      if (!formData.projectName.trim()) {
        toast.error("Please enter project name");
        return;
      }

      if (services.length === 0) {
        toast.error("Please add at least one service");
        return;
      }

      /* --------------------------------------------------------
         VALID SERVICES
         -------------------------------------------------------- */

      const validServices = services.filter(
        (service) =>
          service.title.trim() ||
          service.deliverables.some((item) =>
            item.trim()
          ) ||
          Number(service.price) > 0
      );

      if (validServices.length === 0) {
        toast.error("Please add at least one service");
        return;
      }

      /* --------------------------------------------------------
         SERVICE VALIDATION
         -------------------------------------------------------- */

      for (const service of validServices) {
        if (!service.title.trim()) {
          toast.error("Please enter service name");
          return;
        }

        const validDeliverables =
          service.deliverables.filter((item) =>
            item.trim()
          );

        if (validDeliverables.length === 0) {
          toast.error(
            `Please add at least one deliverable for ${service.title}`
          );
          return;
        }

        if (
          !service.price ||
          Number(service.price) <= 0
        ) {
          toast.error(
            `Please enter a valid price for ${service.title}`
          );
          return;
        }
      }

      /* --------------------------------------------------------
         START LOADING
         -------------------------------------------------------- */

      setLoading(true);

      /* --------------------------------------------------------
         FINAL SERVICES ARRAY
         -------------------------------------------------------- */

      const formattedServices = validServices.map(
        (service, index) => ({
          no: String(index + 1).padStart(2, "0"),

          title: service.title.trim(),

          deliverables: service.deliverables
            .filter((item) => item.trim())
            .map((item) => item.trim()),

          price: Number(service.price) || 0,
        })
      );

      /* --------------------------------------------------------
         FINAL QUOTATION OBJECT
         -------------------------------------------------------- */

      const quotation = {
        quotationNumber,

        date: formData.date,

        validUntil: formData.validUntil,

        billing: formData.billing,

        business: {
          name: formData.BbusinessName,
          email: formData.Bemail,
          phone: formData.Bphone,
          address: formData.Baddress,
        },

        client: {
          name: formData.CbusinessName,
          email: formData.Cemail,
          phone: formData.Cphone,
          address: formData.Caddress,
        },

        project: {
          name: formData.projectName,
          description: formData.projectDescription,
        },

        

        services: formattedServices,

        terms: terms
          .filter((term) => term.trim())
          .map((term) => term.trim()),

       

        total:total,
      };
   /* --------------------------------------------------------
         SAVE QUOTATION IN LOCAL STATE
         -------------------------------------------------------- */

      setCreatedQuotation(quotation);

      /* --------------------------------------------------------
         DEBUG
         -------------------------------------------------------- */

      console.log(
        "CREATED QUOTATION:",
        quotation
      );

  /* --------------------------------------------------------
        | CALLING API FROM BACKEND  
         -------------------------------------------------------- */
       
 let token=getCookie("token")
        const response= await axios.post(`${backendUrl}/createqoutation`,{"formData":quotation},{headers:{token}})
        console.log(response.data)

        
        if(response.data.success=== true){
                 toast.success(
        "Quotation created successfully"
      );
    
        }
        else{
            toast.error(response.data.error)
        }
     

      /* --------------------------------------------------------
         API CALL CAN BE ADDED HERE

         Example:

         await axios.post(
           `${backendUrl}/createquotation`,
           quotation
         );

         -------------------------------------------------------- */

    } catch (error) {
      console.error(
        "Create quotation error:",
        error
      );

      toast.error(
        error?.message ||
          "Something went wrong while creating quotation"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     RESET CREATED QUOTATION
     ============================================================ */

  const handleResetCreatedQuotation = () => {
    setCreatedQuotation(null);
  };

  /* ============================================================
     UI
     ============================================================ */

  return (
    <div className="min-h-screen bg-slate-50 pb-28">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="sticky top-0 z-40 border-b border-violet-100 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <FileText size={19} />
            </div>

            <div>

              <h1 className="text-base font-bold text-slate-800 sm:text-lg">
                Create Quotation
              </h1>

              <p className="text-[11px] text-slate-400 sm:text-xs">
                Create a professional quotation
              </p>

            </div>

          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600 sm:flex">
            <FileText size={15} />

            New Quotation
          </div>

        </div>

      </div>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="space-y-6">

          {/* ==================================================
              QUOTATION INFORMATION
              ================================================== */}

          <FormSection
            icon={FileText}
            title="Quotation Information"
            description="Basic quotation details"
          >

            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">

              <InputField
                label="Quotation Number"
                name="quotationNumber"
                value={quotationNumber}
                readOnly
              />

              <InputField
                label="Quotation Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                icon={CalendarDays}
              />

              <InputField
                label="Valid Until"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                type="date"
                icon={CalendarDays}
              />

            </div>

          </FormSection>

          {/* ==================================================
              BUSINESS + CLIENT
              ================================================== */}

          <div className="grid gap-6 lg:grid-cols-2">

            {/* BUSINESS */}

            <FormSection
              icon={Building2}
              title="Business Information"
              description="Your business details"
            >

              <div className="space-y-4 p-5">

                <InputField
                  label="Business Name"
                  name="BbusinessName"
                  value={formData.BbusinessName}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Email"
                    name="Bemail"
                    value={formData.Bemail}
                    onChange={handleChange}
                    type="email"
                    placeholder="business@email.com"
                    icon={Mail}
                  />

                  <InputField
                    label="Phone"
                    name="Bphone"
                    value={formData.Bphone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    icon={Phone}
                  />

                </div>

                <TextAreaField
                  label="Address"
                  name="Baddress"
                  value={formData.Baddress}
                  onChange={handleChange}
                  placeholder="Business address"
                  rows={3}
                />

              </div>

            </FormSection>

            {/* CLIENT */}

            <FormSection
              icon={User}
              title="Client Information"
              description="Customer billing details"
            >

              <div className="space-y-4 p-5">

                <InputField
                  label="Client / Company Name"
                  name="CbusinessName"
                  value={formData.CbusinessName}
                  onChange={handleChange}
                  placeholder="Client / Company Name"
                />

                <div className="grid gap-4 sm:grid-cols-2">

                  <InputField
                    label="Email"
                    name="Cemail"
                    value={formData.Cemail}
                    onChange={handleChange}
                    type="email"
                    placeholder="client@email.com"
                    icon={Mail}
                  />

                  <InputField
                    label="Phone"
                    name="Cphone"
                    value={formData.Cphone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    icon={Phone}
                  />

                </div>

                <TextAreaField
                  label="Address"
                  name="Caddress"
                  value={formData.Caddress}
                  onChange={handleChange}
                  placeholder="Client address"
                  rows={3}
                />

              </div>

            </FormSection>

          </div>

          {/* ==================================================
              PROJECT INFORMATION
              ================================================== */}

          <FormSection
            icon={BriefcaseBusiness}
            title="Project Information"
            description="Details about the project"
          >

            <div className="space-y-5 p-5">

              <div className="grid gap-5 sm:grid-cols-2">

                <InputField
                  label="Project Name"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Project / Campaign Name"
                />

                <div>

                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Billing
                  </label>

                  <select
                    name="billing"
                    value={formData.billing}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  >

                    <option value="One Time">
                      One Time
                    </option>

                    <option value="Monthly">
                      Monthly
                    </option>

                    <option value="Quarterly">
                      Quarterly
                    </option>

                    <option value="Yearly">
                      Yearly
                    </option>

                  </select>

                </div>

              </div>

              <TextAreaField
                label="Project Description"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                placeholder="Describe the project, scope, goals or requirements"
                rows={4}
              />

            </div>

          </FormSection>

          {/* ==================================================
              SERVICES
              ================================================== */}

          <FormSection
            icon={ClipboardList}
            title="Services"
            description="Add services and their deliverables"
          >

            <div className="p-5">

              <div className="space-y-4">

                {services.map((service, index) => (

                  <div
                    key={service.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >

                    {/* SERVICE HEADER */}

                    <div className="mb-4 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-600">
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div>

                          <p className="text-sm font-bold text-slate-700">
                            Service {index + 1}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Add service details,
                            deliverables and price
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveService(
                            service.id
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                    {/* SERVICE NAME + PRICE */}

                    <div className="grid gap-4 lg:grid-cols-3">

                      {/* SERVICE NAME */}

                      <div className="lg:col-span-2">

                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          Service Name
                        </label>

                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) =>
                            handleServiceChange(
                              service.id,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Social Media Handling"
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                        />

                      </div>

                      {/* PRICE */}

                      <div>

                        <label className="mb-2 block text-xs font-bold text-slate-600">
                          Price
                        </label>

                        <div className="relative">

                          <IndianRupee
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="number"
                            min="0"
                            value={service.price}
                            onChange={(e) =>
                              handleServiceChange(
                                service.id,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="0.00"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                          />

                        </div>

                      </div>

                    </div>

                    {/* ==================================================
                        DELIVERABLES
                        ================================================== */}

                    <div className="mt-5">

                      <div className="mb-2 flex items-center justify-between">

                        <label className="block text-xs font-bold text-slate-600">
                          Deliverables
                        </label>

                        <span className="text-[11px] text-slate-400">
                          {service.deliverables.length}{" "}
                          deliverable
                          {service.deliverables.length !==
                          1
                            ? "s"
                            : ""}
                        </span>

                      </div>

                      <div className="space-y-3">

                        {service.deliverables.map(
                          (
                            deliverable,
                            deliverableIndex
                          ) => (

                            <div
                              key={`${service.id}-${deliverableIndex}`}
                              className="flex gap-2"
                            >

                              {/* NUMBER */}

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xs font-bold text-violet-600">
                                {String(
                                  deliverableIndex + 1
                                ).padStart(2, "0")}
                              </div>

                              {/* INPUT */}

                              <input
                                type="text"
                                value={deliverable}
                                onChange={(e) =>
                                  handleDeliverableChange(
                                    service.id,
                                    deliverableIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="e.g. Instagram management"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                              />

                              {/* REMOVE */}

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveDeliverable(
                                    service.id,
                                    deliverableIndex
                                  )
                                }
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                              >
                                <X size={16} />
                              </button>

                            </div>

                          )
                        )}

                      </div>

                      {/* ADD DELIVERABLE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleAddDeliverable(
                            service.id
                          )
                        }
                        className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-violet-300 px-4 py-2.5 text-xs font-semibold text-violet-600 transition hover:bg-violet-50"
                      >
                        <Plus size={15} />

                        Add Deliverable
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* ADD SERVICE */}

              <button
                type="button"
                onClick={handleAddService}
                className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-violet-300 px-4 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
              >
                <Plus size={16} />

                Add Service
              </button>

            </div>

          </FormSection>

         

          {/* ==================================================
              TERMS
              ================================================== */}

          <FormSection
            icon={FileText}
            title="Terms & Conditions"
            description="Terms included in the quotation"
          >

            <div className="p-5">

              <div className="space-y-3">

                {terms.map((term, index) => (

                  <div
                    key={index}
                    className="flex gap-3"
                  >

                    <div className="flex-1">

                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Term {index + 1}
                      </label>

                      <input
                        type="text"
                        value={term}
                        onChange={(e) =>
                          handleTermChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter quotation term"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                      />

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveTerm(index)
                      }
                      className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                ))}

              </div>

              <button
                type="button"
                onClick={handleAddTerm}
                className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-violet-300 px-4 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
              >
                <Plus size={16} />

                Add Term
              </button>

            </div>

          </FormSection>

          {/* ==================================================
              SUMMARY
              ================================================== */}

          <FormSection
            icon={IndianRupee}
            title="Quotation Summary"
            description="Final quotation amount"
          >

            <div className="p-5">

              <div className="ml-auto w-full max-w-md space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Total Services
                  </span>

                  <span className="font-semibold text-slate-700">
                    {services.length}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Total Deliverables
                  </span>

                  <span className="font-semibold text-slate-700">
                    {services.reduce(
                      (sum, service) =>
                        sum +
                        service.deliverables.filter(
                          (item) =>
                            item.trim()
                        ).length,
                      0
                    )}
                  </span>

                </div>

                <div className="border-t border-violet-100 pt-4">

                  <div className="flex items-center justify-between">

                    <span className="text-base font-bold text-slate-800">
                      Grand Total
                    </span>

                    <span className="text-2xl font-black text-violet-700">
                      ₹{formatMoney(total)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </FormSection>

         

        </div>

      </main>

      {/* ======================================================
          BOTTOM ACTION BAR
          ====================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-violet-100 bg-white/95 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

          <div className="hidden sm:block">

            <p className="text-xs text-slate-400">
              Grand Total
            </p>

            <p className="text-lg font-black text-violet-700">
              ₹{formatMoney(total)}
            </p>

          </div>

          <div className="flex w-full gap-3 sm:w-auto">

            <button
              type="button"
              onClick={handleCreateQuotation}
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >

              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />

                  Create Quotation
                </>
              )}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default QuotationForm;