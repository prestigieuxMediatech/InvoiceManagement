import React, {
  useContext,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  ArrowLeft,
  FileText,
  IndianRupee,
  StickyNote,
  Save,
  User,
  Building2,
  CalendarDays,
} from "lucide-react";

import { toast } from "react-toastify";

import InvoiceItems from "./InvoiceItems";
import { InvoiceContext } from "../Context/InvoiceContext";
import { useLocation } from "react-router-dom";

const generateInvoiceNumber = () => {
  return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
};

const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const InvoiceForm = ({ onClose }) => {
  const location=useLocation()
  const { backendUrl, getCookie , navigate } = useContext(InvoiceContext);

  /* ============================================================
     INVOICE NUMBER
     ============================================================ */

  // Automatically generated only once when invoice form opens.
  const [invoiceNumber] = useState(generateInvoiceNumber);

  /* ============================================================
     FORM DATA
     ============================================================ */

  const [formData, setFormData] = useState({
    BbusinessName: "PRESTIGIEUX MEDIATECH PVT. LTD",
    Bemail: "info.prestigieux@gmail.com",
    Bphone: "91 9136892346",
    Baddress: "Shop No. 6, Plot -21, Sec-09, Ammar Residency CHS, Taloja Phase -1, Panvel Raigad, Pin - 410208",

    CbusinessName: "",
    Cemail: "",
    Cphone: "",
    Caddress: "",

    // Automatically today's date
    date: getCurrentDate(),

    dueDate: "",
  });

  /* ============================================================
     ITEMS
     ============================================================ */

  const [items, setItems] = useState([]);

  const [invoiceTotals, setInvoiceTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
  });

  /* ============================================================
     ADDITIONAL INFORMATION
     ============================================================ */





  /* ============================================================
     LOADING
     ============================================================ */

  const [loading, setLoading] = useState(false);

  /* ============================================================
     HANDLE FORM INPUT
     ============================================================ */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
     RECEIVE ITEMS FROM InvoiceItems
     ============================================================ */

  const handleItemsChange = useCallback((updatedItems, totals) => {
    setItems(updatedItems);

    setInvoiceTotals({
      subtotal: Number(totals?.subtotal) || 0,
      totalDiscount: Number(totals?.totalDiscount) || 0,
      totalTax: Number(totals?.totalTax) || 0,
      grandTotal: Number(totals?.grandTotal) || 0,
    });
  }, []);

  /* ============================================================
     ADD NOTE
     ============================================================ */

  const handleAddNote = () => {
    const note = noteInput.trim();

    if (!note) {
      toast.error("Please enter a note");
      return;
    }

    setAdditionalInfo((prev) => ({
      ...prev,
      notes: [...prev.notes, note],
    }));

    setNoteInput("");
    setShowNoteModal(false);

    toast.success("Note added");
  };

  /* ============================================================
     REMOVE NOTE
     ============================================================ */

  const handleRemoveNote = (index) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  };

  /* ============================================================
     CREATE INVOICE
     ============================================================ */

  const handleSubmit = async () => {
    try {
      /* --------------------------------------------------------
         VALIDATION
         -------------------------------------------------------- */

      if (!invoiceNumber.trim()) {
        toast.error("Invoice number is missing");
        return;
      }

      if (!formData.BbusinessName.trim()) {
        toast.error("Please enter business name");
        return;
      }

      if (!formData.CbusinessName.trim()) {
        toast.error("Please enter customer name");
        return;
      }

      if (!formData.date) {
        toast.error("Please select invoice date");
        return;
      }

      if (items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }

      /* --------------------------------------------------------
         START LOADING
         -------------------------------------------------------- */

      setLoading(true);

      const token = getCookie("token");

      /* --------------------------------------------------------
         PAYLOAD
         -------------------------------------------------------- */

      const payload = {
        invoiceNumber,

        date: formData.date,

        dueDate: formData.dueDate,

        BbusinessName: formData.BbusinessName,
        Bemail: formData.Bemail,
        Bphone: formData.Bphone,
        Baddress: formData.Baddress,

        CbusinessName: formData.CbusinessName,
        Cemail: formData.Cemail,
        Cphone: formData.Cphone,
        Caddress: formData.Caddress,

        item: items,

        additionalInfo:items.notes,

        subtotal: invoiceTotals.subtotal,

        totalDiscount: invoiceTotals.totalDiscount,

        totalTax: invoiceTotals.totalTax,

        grandTotal: invoiceTotals.grandTotal,
        template:location.state
      };

      console.log("CREATE INVOICE PAYLOAD:", payload);

      /* --------------------------------------------------------
         API REQUEST
         -------------------------------------------------------- */

      const response = await axios.post(
        `${backendUrl}/createinvoice`,
        payload,
        {
          headers: {
            token,
          },
        }
      );

      console.log("Invoice response:", response.data);

      /* --------------------------------------------------------
         SUCCESS
         -------------------------------------------------------- */

      if (response.data?.success !== false) {
        toast.success("Invoice created successfully");
         navigate('/allinvoice')

        if (onClose) {
          onClose();
         
        }
      } else {
        toast.error(
          response.data?.message || "Unable to create invoice"
        );
      }
    } catch (error) {
      console.error("Create invoice error:", error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while creating invoice"
      );
    } finally {
      setLoading(false);
    }
  };

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
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-600"
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-base font-bold text-slate-800 sm:text-lg">
                Create Invoice
              </h1>

              <p className="text-[11px] text-slate-400 sm:text-xs">
                Create a professional invoice
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-600 sm:flex">
            <FileText size={15} />
            New Invoice
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* ==================================================
              INVOICE INFORMATION
              ================================================== */}

          <section className="rounded-2xl border border-violet-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <FileText size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Invoice Information
                </h2>

                <p className="text-xs text-slate-400">
                  Basic invoice details
                </p>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* INVOICE NUMBER */}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Invoice Number
                </label>

                <input
                  type="text"
                  value={invoiceNumber}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 outline-none"
                />
              </div>

              {/* INVOICE DATE */}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Invoice Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>
              </div>

              {/* DUE DATE */}

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-600">
                  Due Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ==================================================
              BUSINESS + CUSTOMER
              ================================================== */}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* BUSINESS */}

            <section className="rounded-2xl border border-violet-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Building2 size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Business Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Your business details
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Business Name
                  </label>

                  <input
                    type="text"
                    name="BbusinessName"
                    value={formData.BbusinessName}
                    onChange={handleChange}
                    placeholder="Your Business Name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Email
                    </label>

                    <input
                      type="email"
                      name="Bemail"
                      value={formData.Bemail}
                      onChange={handleChange}
                      placeholder="business@email.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="Bphone"
                      value={formData.Bphone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Address
                  </label>

                  <textarea
                    name="Baddress"
                    value={formData.Baddress}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Business address"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>
              </div>
            </section>

            {/* CUSTOMER */}

            <section className="rounded-2xl border border-violet-100 bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <User size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Customer Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Customer billing details
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="CbusinessName"
                    value={formData.CbusinessName}
                    onChange={handleChange}
                    placeholder="Customer / Company Name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Email
                    </label>

                    <input
                      type="email"
                      name="Cemail"
                      value={formData.Cemail}
                      onChange={handleChange}
                      placeholder="customer@email.com"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold text-slate-600">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="Cphone"
                      value={formData.Cphone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Address
                  </label>

                  <textarea
                    name="Caddress"
                    value={formData.Caddress}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Customer address"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ==================================================
              ITEMS
              ================================================== */}

          <InvoiceItems onItemsChange={handleItemsChange} />

        

          {/* ==================================================
              FINAL SUMMARY
              ================================================== */}

          <section className="rounded-2xl border border-violet-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-violet-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <IndianRupee size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Invoice Summary
                </h2>

                <p className="text-xs text-slate-400">
                  Final invoice amount
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="ml-auto w-full max-w-md space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-semibold text-slate-700">
                    ₹{formatMoney(invoiceTotals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="font-semibold text-rose-500">
                    - ₹{formatMoney(invoiceTotals.totalDiscount)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">
                    Tax
                  </span>

                  <span className="font-semibold text-violet-600">
                    + ₹{formatMoney(invoiceTotals.totalTax)}
                  </span>
                </div>

                <div className="border-t border-violet-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-800">
                      Grand Total
                    </span>

                    <span className="text-2xl font-black text-violet-700">
                      ₹{formatMoney(invoiceTotals.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
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
              ₹{formatMoney(invoiceTotals.grandTotal)}
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
         

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className=" cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />

                  Create Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default InvoiceForm;