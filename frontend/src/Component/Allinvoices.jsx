
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import axios from "axios";
import { InvoiceContext } from "../Context/InvoiceContext";
import { toast } from "react-toastify";

const Allinvoices = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  const [invoice, setInvoices] = useState([]);

  const { backendUrl, getCookie, navigate } = useContext(InvoiceContext);
  const token=getCookie("token")
  // ============================================================
  // GET ALL INVOICES
  // ============================================================

  const getALlInvoices = async () => {
    try {
      const token = getCookie("token");

      const response = await axios.get(
        `${backendUrl}/allinvoices`,
        {
          headers: {
            token,
          },
        }
      );

      console.log(response.data);

      // Store actual backend data
      setInvoices(response.data.data || []);

    } catch (e) {
      console.log(e.message);
    }
  };


  const deleteInvoice= async(id)=>{
    try{
      
      const response=await axios.delete(`${backendUrl}/deleteinvoice/${id}`,{headers:{token}})
      console.log(response)
      if(response.data.success == true){
        toast.success("invoice deleted successfully ")
        window.location.reload()
      }
    }
    catch(e){
      console.log(e.message)
      toast.error(e.message)
    }
  }

  useEffect(() => {
    getALlInvoices();
  }, []);

  // ============================================================
  // FORMAT CURRENCY
  // ============================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // FILTER INVOICES
  // ============================================================

  const filteredInvoices = useMemo(() => {
    return invoice.filter((invoice) => {
      const value = search.toLowerCase().trim();

      const matchesSearch =
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(value) ||
        invoice.CbusinessName
          ?.toLowerCase()
          .includes(value) ||
        invoice.Cemail
          ?.toLowerCase()
          .includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        invoice.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [invoice, search, statusFilter]);

  // ============================================================
  // TOTAL AMOUNT
  // ============================================================

  const totalAmount = invoice.reduce(
    (total, invoice) =>
      total + Number(invoice.grandTotal || 0),
    0
  );

  // ============================================================
  // PAID AMOUNT
  // ============================================================

  const paidAmount = invoice
    .filter(
      (invoice) =>
        invoice.status?.toLowerCase() === "paid"
    )
    .reduce(
      (total, invoice) =>
        total + Number(invoice.grandTotal || 0),
      0
    );

  // ============================================================
  // PENDING / UNPAID AMOUNT
  // ============================================================

  const pendingAmount = invoice
    .filter(
      (invoice) =>
        invoice.status?.toLowerCase() === "unpaid"
    )
    .reduce(
      (total, invoice) =>
        total + Number(invoice.grandTotal || 0),
      0
    );

  // ============================================================
  // OVERDUE AMOUNT
  // ============================================================

  const overdueAmount = invoice
    .filter(
      (invoice) =>
        invoice.status?.toLowerCase() === "overdue"
    )
    .reduce(
      (total, invoice) =>
        total + Number(invoice.grandTotal || 0),
      0
    );

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "unpaid":
      case "pending":
        return "bg-violet-100 text-violet-800 border-violet-200";

      case "overdue":
        return "bg-violet-200 text-violet-900 border-violet-300";

      default:
        return "bg-violet-50 text-violet-700 border-violet-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-900">
      <main className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-6 sm:py-6 lg:px-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <FileText size={18} />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-violet-600 sm:text-xs">
                Invoice Management
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              All Invoices
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track all your invoices from one place.
            </p>
          </div>

          <button
          onClick={()=>{navigate('/alltemplate')}}
            type="button"
            className="
               cursor-pointer
              flex
              h-11
              w-full
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-violet-600
              px-5
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-violet-700
              sm:w-auto
            "
          >
            <Plus size={17} />
            Create Invoice
          </button>
        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_30px_rgba(124,58,237,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Total Invoices
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {invoice.length}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {formatCurrency(totalAmount)} total value
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 sm:h-11 sm:w-11">
                <FileText size={20} />
              </div>
            </div>
          </div>

          {/* PAID */}

          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_30px_rgba(124,58,237,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Paid
                </p>

                <h2 className="mt-2 truncate text-xl font-black text-slate-950 sm:text-2xl">
                  {formatCurrency(paidAmount)}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    invoice.filter(
                      (i) =>
                        i.status?.toLowerCase() ===
                        "paid"
                    ).length
                  }{" "}
                  paid invoices
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 sm:h-11 sm:w-11">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          {/* PENDING */}

          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_30px_rgba(124,58,237,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Pending
                </p>

                <h2 className="mt-2 truncate text-xl font-black text-slate-950 sm:text-2xl">
                  {formatCurrency(pendingAmount)}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    invoice.filter(
                      (i) =>
                        i.status?.toLowerCase() ===
                        "unpaid"
                    ).length
                  }{" "}
                  awaiting payment
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 sm:h-11 sm:w-11">
                <Clock3 size={20} />
              </div>
            </div>
          </div>

          {/* OVERDUE */}

          <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-[0_8px_30px_rgba(124,58,237,0.06)] sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-xs">
                  Overdue
                </p>

                <h2 className="mt-2 truncate text-xl font-black text-slate-950 sm:text-2xl">
                  {formatCurrency(overdueAmount)}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {
                    invoice.filter(
                      (i) =>
                        i.status?.toLowerCase() ===
                        "overdue"
                    ).length
                  }{" "}
                  overdue invoices
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-200 text-violet-800 sm:h-11 sm:w-11">
                <AlertCircle size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            INVOICE LIST
        ====================================================== */}

        <section className="mt-5 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_10px_40px_rgba(124,58,237,0.06)] sm:mt-6">

          {/* =================================================
              TOOLBAR
          ================================================== */}

          <div className="border-b border-violet-100 p-4 sm:p-6">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Invoice List
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredInvoices.length} invoices found
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

                {/* SEARCH */}

                <div className="relative w-full sm:flex-1 xl:w-[280px]">
                  <Search
                    size={17}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-violet-400
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search invoices..."
                    className="
                      h-11
                      w-full
                      rounded-xl
                      border
                      border-violet-100
                      bg-violet-50/40
                      pl-10
                      pr-4
                      text-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-violet-400
                      focus:bg-white
                      focus:ring-4
                      focus:ring-violet-50
                    "
                  />
                </div>

                {/* FILTER */}

                <div className="relative w-full sm:w-[170px]">
                  <SlidersHorizontal
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-violet-400
                    "
                  />

                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                    className="
                      h-11
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-violet-100
                      bg-violet-50/40
                      pl-9
                      pr-10
                      text-sm
                      font-semibold
                      text-slate-700
                      outline-none
                      focus:border-violet-400
                      focus:ring-4
                      focus:ring-violet-50
                    "
                  >
                    <option value="All">
                      All Status
                    </option>

                    <option value="Paid">
                      Paid
                    </option>

                    <option value="unpaid">
                      Unpaid
                    </option>

                    <option value="Overdue">
                      Overdue
                    </option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-violet-400
                    "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              RESPONSIVE TABLE
          ================================================== */}

          <div className="w-full">

            {/* MOBILE SCROLL HINT */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-violet-100
                bg-violet-50/60
                px-3
                py-2
                md:hidden
              "
            >
              <span className="text-[10px] font-semibold text-violet-500">
                ← Swipe table →
              </span>

              <span className="text-[10px] text-slate-400">
                More details →
              </span>
            </div>

            {/* TABLE CONTAINER */}

            <div
              className="
                w-full
                overflow-x-auto
                overscroll-x-contain
                scrollbar-thin
                scrollbar-thumb-violet-200
                scrollbar-track-transparent
              "
            >
              <table
                className="
                  w-full
                  min-w-[760px]
                  table-auto
                  border-collapse
                "
              >

                {/* TABLE HEADER */}

                <thead>
                  <tr
                    className="
                      border-b
                      border-violet-100
                      bg-violet-50/70
                      text-left
                    "
                  >

                    <th
                      className="
                        bg-violet-50
                        px-3
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Invoice
                    </th>

                    <th
                      className="
                        w-[190px]
                        min-w-[190px]
                        px-4
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Customer
                    </th>

                    <th
                      className="
                        w-[125px]
                        min-w-[125px]
                        px-4
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Issue Date
                    </th>

                    <th
                      className="
                        w-[125px]
                        min-w-[125px]
                        px-4
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Due Date
                    </th>

                    <th
                      className="
                        w-[120px]
                        min-w-[120px]
                        px-4
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Amount
                    </th>

                    <th
                      className="
                        w-[110px]
                        min-w-[110px]
                        px-4
                        py-3
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        sticky
                        right-0
                        z-30
                        w-[70px]
                        min-w-[70px]
                        bg-violet-50
                        px-3
                        py-3
                        text-right
                        text-[9px]
                        font-extrabold
                        uppercase
                        tracking-wider
                        text-violet-600
                        sm:px-5
                        sm:py-4
                        sm:text-[10px]
                      "
                    >
                      Action
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody className="divide-y divide-violet-50">

                  {filteredInvoices.length > 0 ? (

                    filteredInvoices.map((invoice) => (

                      <tr
                        key={invoice._id}
                        className="
                          group
                          transition-colors
                          hover:bg-violet-50/40
                        "
                      >

                        {/* INVOICE */}

                        <td
                          className="
                            bg-white
                            px-3
                            py-4
                            group-hover:bg-violet-50
                            sm:px-5
                            sm:py-5
                          "
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3">

                            <div
                              className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                bg-violet-100
                                text-violet-600
                                sm:h-10
                                sm:w-10
                                sm:rounded-xl
                              "
                            >
                              <FileText
                                size={15}
                                className="sm:h-[17px] sm:w-[17px]"
                              />
                            </div>

                            <div className="min-w-0">

                              <p
                              onClick={()=>{
                               navigate(`${invoice.template =='template1' ? '/template': '/template1'}`, {state:invoice._id})
                              }}
                                className="
                                 cursor-pointer
                                  whitespace-nowrap
                                  text-xs
                                  font-bold
                                  text-slate-900
                                  sm:text-sm
                                "
                              >
                                {invoice.invoiceNumber}
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  text-[9px]
                                  text-slate-400
                                  sm:text-[11px]
                                "
                              >
                                Invoice
                              </p>

                            </div>

                          </div>
                        </td>

                        {/* CUSTOMER */}

                        <td className="px-4 py-4 sm:px-5 sm:py-5">

                          <p
                            className="
                              max-w-[170px]
                              truncate
                              whitespace-nowrap
                              text-xs
                              font-bold
                              text-slate-900
                              sm:text-sm
                            "
                          >
                            {invoice.CbusinessName}
                          </p>

                          <p
                            className="
                              mt-1
                              max-w-[170px]
                              truncate
                              whitespace-nowrap
                              text-[10px]
                              text-slate-400
                              sm:text-xs
                            "
                          >
                            {invoice.Cemail}
                          </p>

                        </td>

                        {/* ISSUE DATE */}

                        <td className="px-4 py-4 sm:px-5 sm:py-5">

                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              whitespace-nowrap
                              text-xs
                              font-medium
                              text-slate-700
                              sm:gap-2
                              sm:text-sm
                            "
                          >

                            <CalendarDays
                              size={13}
                              className="
                                shrink-0
                                text-violet-400
                                sm:h-[15px]
                                sm:w-[15px]
                              "
                            />

                            {formatDate(invoice.date)}

                          </div>

                        </td>

                        {/* DUE DATE */}

                        <td className="px-4 py-4 sm:px-5 sm:py-5">

                          <p
                            className="
                              whitespace-nowrap
                              text-xs
                              font-medium
                              text-slate-700
                              sm:text-sm
                            "
                          >
                            {formatDate(invoice.dueDate)}
                          </p>

                        </td>

                        {/* AMOUNT */}

                        <td className="px-4 py-4 sm:px-5 sm:py-5">

                          <p
                            className="
                              whitespace-nowrap
                              text-xs
                              font-black
                              text-slate-950
                              sm:text-sm
                            "
                          >
                            {formatCurrency(
                              invoice.grandTotal
                            )}
                          </p>

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4 sm:px-5 sm:py-5">

                          <span
                            className={`
                              inline-flex
                              whitespace-nowrap
                              rounded-full
                              border
                              px-2.5
                              py-1
                              text-[9px]
                              font-bold
                              sm:px-3
                              sm:py-1.5
                              sm:text-[11px]
                              ${getStatusStyle(
                                invoice.status
                              )}
                            `}
                          >
                            {invoice.status}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td
                          className="
                             absolute
                             z-100
                             right-8
                            sm:right-20
                        
                            bg-white
                            px-3
                            py-4
                            text-right
                            group-hover:bg-violet-50
                            sm:px-5
                            sm:py-5
                          "
                        >

                          <div className="relative">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === invoice._id
                                    ? null
                                    : invoice._id
                                )
                              }
                              className="
                                inline-flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-violet-100
                                hover:text-violet-700
                                sm:h-9
                                sm:w-9
                              "
                            >
                              <MoreHorizontal
                                size={17}
                                className="sm:h-[19px] sm:w-[19px]"
                              />
                            </button>

                            {/* ACTION MENU */}

                            {openMenu === invoice._id && (

                              <div
                                className="
                                  absolute
                                  right-0
                                  top-10
                                  z-[100]
                                  w-44
                                  rounded-xl
                                  border
                                  border-violet-100
                                  bg-white
                                  p-1.5
                                  text-left
                                  shadow-[0_15px_40px_rgba(124,58,237,0.15)]
                                  sm:top-11
                                "
                              >

                               

                                <button
                                onClick={()=>{
                                  navigate('/updateinvoice',{state:invoice._id})
                                }}
                                  type="button"
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-slate-700
                                    transition
                                    hover:bg-violet-50
                                    hover:text-violet-700
                                  "

                                >
                                  <Pencil size={15} />
                                  Edit Invoice
                                </button>

                                <button
                                  type="button"
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-slate-700
                                    transition
                                    hover:bg-violet-50
                                    hover:text-violet-700
                                  "
                                >
                                  <Download size={15} />
                                  Download PDF
                                </button>

                                <div className="my-1 border-t border-violet-100" />

                                <button
                                  onClick={()=>{deleteInvoice(invoice._id)}}

                                  type="button"
                                  className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-violet-600
                                    transition
                                    hover:bg-violet-50
                                  "
                                >
                                  <Trash2 size={15} />
                                  Delete
                                </button>

                              </div>
                            )}

                          </div>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td colSpan="7">

                        <div
                          className="
                            flex
                            min-h-[280px]
                            flex-col
                            items-center
                            justify-center
                            px-5
                            text-center
                          "
                        >

                          <div
                            className="
                              flex
                              h-14
                              w-14
                              items-center
                              justify-center
                              rounded-2xl
                              bg-violet-50
                              text-violet-400
                            "
                          >
                            <Search size={23} />
                          </div>

                          <h3 className="mt-4 text-base font-black text-slate-900">
                            No invoices found
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Try changing your search or filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* MOBILE SCROLL FOOTER / RESULT COUNT */}

          <div className="border-t border-violet-100 bg-violet-50/40 px-4 py-4 sm:px-5">

            <p className="text-xs font-semibold text-slate-500">

              Showing{" "}

              <span className="font-black text-violet-700">
                {filteredInvoices.length}
              </span>{" "}

              of{" "}

              <span className="font-black text-slate-900">
                {invoice.length}
              </span>{" "}

              invoices

            </p>

          </div>

        </section>
      </main>
    </div>
  );
};

export default Allinvoices;
