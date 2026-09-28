import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Briefcase,
  Calendar,
  IndianRupee,
  Phone,
} from "lucide-react";
import { InvoiceContext } from "../Context/InvoiceContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InvoiceFormSkeleton from "./InvoiceFormSkeleton";

const EditQoutation = () => {
  const { backendUrl, getCookie, navigate } =
    useContext(InvoiceContext);

  const [loading, setLoading] = useState(false);

  const [quotation, setQuotation] = useState({
    quotationNumber: "",
    issueDate: "",
   

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
       Only client phone is required
       ---------------------------------------------------------- */

    Cphone: "",

    /* ----------------------------------------------------------
       BILLING
       ---------------------------------------------------------- */

    billing: "Monthly",

    /* ----------------------------------------------------------
       SERVICES
       ---------------------------------------------------------- */

    services: [
      {
        title: "",
        deliverables: [""],
        no: 1,
        price: "",
      },
    ],

    /* ----------------------------------------------------------
       TERMS
       ---------------------------------------------------------- */

    terms: [""],
  });

  const token = getCookie("token");
  const location = useLocation();

  // ----------------------------------------------------------
  // GET QUOTATION
  // ----------------------------------------------------------

  const getQoutation = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendUrl}/get-qoutation-by-id/${location.state}`,
        {
          headers: {
            token,
          },
        }
      );

      console.log("Quotation Response:", response.data);

      const qoutationData = response.data.Qoutation;

      setQuotation({
        quotationNumber: qoutationData.quotationNumber || "",

        issueDate: qoutationData.date || "",

        validUntil: qoutationData.validUntil || "",

        BbusinessName:
          qoutationData.business?.name ||
          "PRESTIGIEUX MEDIATECH PVT. LTD",

        Bemail:
          qoutationData.business?.email ||
          "info.prestigieux@gmail.com",

        Bphone:
          qoutationData.business?.phone ||
          "91 9136892346",

        Baddress:
          qoutationData.business?.address ||
          "Shop No. 6, Plot -21, Sec-09, Ammar Residency CHS, Taloja Phase -1, Panvel Raigad, Pin - 410208",

        Cphone:
          qoutationData.business?.Cphone ||
          response.data.business?.Cphone ||
          "",

        billing: qoutationData.billing || "Monthly",

        services:
          qoutationData.services?.length > 0
            ? qoutationData.services
            : [
                {
                  title: "",
                  deliverables: [""],
                  no: 1,
                  price: "",
                },
              ],

        terms:
          qoutationData.terms?.length > 0
            ? qoutationData.terms
            : [""],
      });

      setLoading(false);
    } catch (e) {
      setLoading(false);

      console.log(e.message);
      toast.error(e.message);
    }
  };

  // ----------------------------------------------------------
  // LOAD QUOTATION
  // ----------------------------------------------------------

  useEffect(() => {
    getQoutation();
  }, []);

  // ----------------------------------------------------------
  // DEBUG
  // ----------------------------------------------------------

  useEffect(() => {
    console.log("Updated Quotation:", quotation);
  }, [quotation]);

  // ----------------------------------------------------------
  // QUOTATION FIELD CHANGE
  // ----------------------------------------------------------

  const handleQuotationChange = (e) => {
    const { name, value } = e.target;

    setQuotation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ----------------------------------------------------------
  // SERVICE FIELD CHANGE
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // ADD SERVICE
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // REMOVE SERVICE
  // ----------------------------------------------------------

  const removeService = (index) => {
    setQuotation((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------------
  // TERMS
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // ADD TERM
  // ----------------------------------------------------------

  const addTerm = () => {
    setQuotation((prev) => ({
      ...prev,
      terms: [...prev.terms, ""],
    }));
  };

  // ----------------------------------------------------------
  // REMOVE TERM
  // ----------------------------------------------------------

  const removeTerm = (index) => {
    setQuotation((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------------
  // DESCRIPTION / DELIVERABLE CHANGE
  // ----------------------------------------------------------

  const handleDescriptionChange = (
    serviceIndex,
    descriptionIndex,
    value
  ) => {
    setQuotation((prev) => {
      const services = [...prev.services];

      const descriptions = [
        ...(services[serviceIndex]?.deliverables || []),
      ];

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

  // ----------------------------------------------------------
  // ADD DELIVERABLE
  // ----------------------------------------------------------

  const addDescription = (serviceIndex) => {
    setQuotation((prev) => {
      const services = [...prev.services];

      const currentDeliverables =
        services[serviceIndex]?.deliverables || [];

      services[serviceIndex] = {
        ...services[serviceIndex],
        deliverables: [...currentDeliverables, ""],
      };

      return {
        ...prev,
        services,
      };
    });
  };

  // ----------------------------------------------------------
  // REMOVE DELIVERABLE
  // ----------------------------------------------------------

  const removeDescription = (
    serviceIndex,
    descriptionIndex
  ) => {
    setQuotation((prev) => {
      const services = [...prev.services];

      const currentDeliverables =
        services[serviceIndex]?.deliverables || [];

      const descriptions = currentDeliverables.filter(
        (_, index) => index !== descriptionIndex
      );

      services[serviceIndex] = {
        ...services[serviceIndex],
        deliverables:
          descriptions.length > 0 ? descriptions : [""],
      };

      return {
        ...prev,
        services,
      };
    });
  };

  // ----------------------------------------------------------
  // TOTAL
  // ----------------------------------------------------------

  const total = quotation.services.reduce(
    (sum, service) => {
      const quantity = Number(service.no || 0);
      const price = Number(service.price || 0);

      return sum + quantity * price;
    },
    0
  );

  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const finalData = {
        ...quotation,

        total,

        terms: quotation.terms.filter(
          (term) => term.trim() !== ""
        ),

        services: quotation.services.map((service) => ({
          ...service,

          deliverables: service.deliverables.filter(
            (item) => item.trim() !== ""
          ),
        })),
      };

      console.log("QUOTATION DATA:", finalData);

      const response = await axios.post(
        `${backendUrl}/update-qoutation-by-id/${location.state}`,
        {
          data: finalData,
        },
        {
          headers: {
            token,
          },
        }
      );

      console.log("Update Response:", response);

      if (response.data.success === true) {
        toast.success("Quotation Edited Successfully");

        navigate("/allqoutation");
      }
    } catch (e) {
      setLoading(false);

      console.log(e.message);

      toast.error(e.message);
    }
  };

  return loading ? (
    <InvoiceFormSkeleton />
  ) : (
    <div className="min-h-screen bg-[#f7f7f8] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm">
              <FileText size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit Quotation
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Update your professional quotation
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ===================================================
              QUOTATION INFORMATION
          =================================================== */}

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
                  className="form-input"
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
                    className="form-input pl-10"
                  />

                </div>
              </div>

             

            </div>

          </section>

          {/* ===================================================
              CLIENT PHONE
          =================================================== */}

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">

            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Phone size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Client Contact
                </h2>

                <p className="text-xs text-gray-500">
                  Enter your client's WhatsApp phone number
                </p>
              </div>

            </div>

            <div className="max-w-md">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Client Phone
              </label>

              <input
                type="tel"
                name="Cphone"
                value={quotation.Cphone}
                onChange={handleQuotationChange}
                placeholder="+91 9876543210"
                required
                className="form-input"
              />

            </div>

          </section>

          {/* ===================================================
              BILLING
          =================================================== */}

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
              <option value="Monthly">
                Monthly
              </option>

              <option value="One-time">
                One-time
              </option>

              <option value="Quarterly">
                Quarterly
              </option>

              <option value="Yearly">
                Yearly
              </option>
            </select>

          </section>

          {/* ===================================================
              SERVICES
          =================================================== */}

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

              {quotation.services.map(
                (service, index) => (

                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >

                    {/* Service Header */}

                    <div className="mb-4 flex items-center justify-between">

                      <h3 className="text-sm font-semibold text-gray-800">
                        Service {index + 1}
                      </h3>

                      {quotation.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeService(index)
                          }
                          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>
                      )}

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">

                      {/* Service Name */}

                      <div className="md:col-span-4">

                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Service Name
                        </label>

                        <input
                          type="text"
                          name="title"
                          value={service.title}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              e
                            )
                          }
                          placeholder="Social Media Handling"
                          required
                          className="form-input"
                        />

                      </div>

                      {/* Deliverables */}

                      <div className="md:col-span-4">

                        <div className="mb-2 flex items-center justify-between">

                          <label className="text-sm font-medium text-gray-700">
                            Description / Deliverables
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              addDescription(index)
                            }
                            className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
                          >
                            <Plus size={14} />
                            Add
                          </button>

                        </div>

                        <div className="space-y-2">

                          {(
                            service.deliverables || [
                              "",
                            ]
                          ).map(
                            (
                              description,
                              descriptionIndex
                            ) => (

                              <div
                                key={
                                  descriptionIndex
                                }
                                className="flex items-center gap-2"
                              >

                                <input
                                  type="text"
                                  value={
                                    description
                                  }
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

                                {service
                                  .deliverables
                                  ?.length >
                                  1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeDescription(
                                        index,
                                        descriptionIndex
                                      )
                                    }
                                    className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                                  >
                                    <Trash2
                                      size={16}
                                    />
                                  </button>
                                )}

                              </div>
                            )
                          )}

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
                          name="no"
                          value={service.no}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              e
                            )
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
                            value={
                              service.price
                            }
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                e
                              )
                            }
                            placeholder="5000"
                            required
                            className="form-input pl-9"
                          />

                        </div>

                      </div>

                    </div>

                    {/* Service Total */}

                    <div className="mt-4 flex justify-end">

                      <div className="text-right">

                        <p className="text-xs text-gray-500">
                          Service Total
                        </p>

                        <p className="text-lg font-bold text-gray-900">
                          ₹
                          {(
                            Number(
                              service.no || 0
                            ) *
                            Number(
                              service.price || 0
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* Grand Total */}

            <div className="mt-6 flex justify-end">

              <div className="w-full rounded-xl bg-violet-50 p-5 sm:w-[320px]">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-violet-700">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

            </div>

          </section>

          {/* ===================================================
              TERMS
          =================================================== */}

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

              {quotation.terms.map(
                (term, index) => (

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
                        handleTermChange(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter quotation term"
                      className="form-input"
                    />

                    {quotation.terms.length >
                      1 && (
                      <button
                        type="button"
                        onClick={() =>
                          removeTerm(index)
                        }
                        className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                  </div>
                )
              )}

            </div>

          </section>

          {/* ===================================================
              SUBMIT
          =================================================== */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="submit"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <FileText size={17} />
              Edit Quotation
            </button>

          </div>

        </form>
      </div>

      {/* =====================================================
          REUSABLE INPUT STYLES
      ===================================================== */}

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
  );
};

export default EditQoutation;