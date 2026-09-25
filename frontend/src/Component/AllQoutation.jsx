
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Download,
  Trash2,
  FileText,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { InvoiceContext } from "../Context/InvoiceContext";
import Quatation from "./Quatation";

const AllQuotation = () => {
  const [search, setSearch] = useState("");
  const{backendUrl, getCookie,navigate}=useContext(InvoiceContext)
  const token=getCookie("token")
  const [quotations, setQuotations] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);


// get ALL Qoutation from backend 
const getQoutation = async () => {
  try {
    const response = await axios.get(
      `${backendUrl}/getqoutation`,
      {
        headers: { token },
      }
    );

    console.log(response.data.Qoutation);

    const formattedQuotations = response.data.Qoutation.map((quotation) => ({
      ...quotation,

      clientName:
        quotation.client?.name ||
        quotation.customer?.name ||
        "",

      clientEmail:
        quotation.client?.email ||
        quotation.customer?.email ||
        "",

      project:
        quotation.project?.name ||
        quotation.project?.title ||
        quotation.business?.name ||
        "",

      validUntil:
        quotation.validUntil ||
        "",

      amount:
        quotation.grandTotal ||
        quotation.total ||
        quotation.amount ||
        0,
    }));
    console.log(formattedQuotations)

    setQuotations(formattedQuotations);

  } catch (e) {
    console.log(e.message);
  }
};


useEffect(()=>{
getQoutation()
},[])
  /* =========================================================
     FORMAT PRICE
  ========================================================== */

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /* =========================================================
     FILTER DATA
  ========================================================== */

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        quotation.quotationNumber
          .toLowerCase()
          .includes(searchValue) ||
        quotation.clientName
          .toLowerCase()
          .includes(searchValue) ||
        quotation.clientEmail
          .toLowerCase()
          .includes(searchValue) ||
        quotation.project
          .toLowerCase()
          .includes(searchValue);


      return matchesSearch ;
    });
  }, [quotations, search,]);

  

 

  return (
    <div className="min-h-screen bg-[#f7f7f8] p-3 sm:p-5 lg:p-7">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <FileText size={20} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                All Quotations
              </h1>

              <p className="text-xs text-gray-500 sm:text-sm">
                Manage and track all your quotations
              </p>
            </div>

          </div>
        </div>


        {/* ADD BUTTON */}

        <button
          onClick={() => {
            navigate('/createqoutation')
          }}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-violet-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-sm
            transition
            hover:bg-violet-700
            sm:w-auto
          "
        >
          <Plus size={18} />
          Create Quotation
        </button>

      </div>




      {/* =====================================================
          TABLE CONTAINER
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* ===================================================
            FILTER BAR
        ==================================================== */}

        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-gray-200
            p-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          {/* SEARCH */}

          <div className="relative w-full ">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotation, client or project..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                py-2.5
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-violet-400
                focus:bg-white
                focus:ring-2
                focus:ring-violet-100
              "
            />

          </div>


         

        </div>


        {/* MOBILE SWIPE HINT */}

        <div
          className="
            border-b
            border-violet-100
            bg-violet-50/50
            px-4
            py-2
            text-[10px]
            font-semibold
            text-violet-500
            sm:hidden
          "
        >
          ← Swipe horizontally to view all quotation details →
        </div>


        {/* ===================================================
            TABLE
        ==================================================== */}


<div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
  {/* Mobile scroll hint */}
  <div className="border-b border-violet-100 bg-violet-50 px-4 py-2 text-[10px] font-semibold text-violet-500 sm:hidden">
    ← Swipe horizontally to view all quotation details →
  </div>

<div className="w-full overflow-x-auto">
  <table className="w-full min-w-[1050px] border-collapse">

    {/* TABLE HEADER */}
    <thead>
      <tr className="bg-violet-600 text-left text-xs font-bold uppercase tracking-wide text-white">

        <th className="w-[190px] px-5 py-4">
          Quotation
        </th>

        <th className="w-[230px] px-5 py-4">
          Client
        </th>

        <th className="w-[250px] px-5 py-4">
          Project
        </th>

        <th className="w-[140px] whitespace-nowrap px-5 py-4">
          Date
        </th>

        <th className="w-[150px] whitespace-nowrap px-5 py-4">
          Valid Until
        </th>

        <th className="w-[150px] whitespace-nowrap px-5 py-4 text-right">
          Amount
        </th>

        {/* STICKY ACTION HEADER */}
        <th
          className="
            sticky
            right-0
            z-30
            w-[80px]
            bg-violet-600
            px-3
            py-4
            text-center
          "
        >
          Actions
        </th>

      </tr>
    </thead>

    {/* TABLE BODY */}
    <tbody>

      {filteredQuotations.length > 0 ? (

        filteredQuotations.map((quotation) => (

          <tr
          onClick={()=>{
           
          }}
            key={quotation._id}
            className="
             cursor-pointer
              border-b
              border-gray-100
              transition
              hover:bg-violet-50/40
            "
          >

            {/* QUOTATION */}
            <td className="px-5 py-4">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-violet-100
                    text-violet-600
                  "
                >
                  <FileText size={18} />
                </div>

                <div className="min-w-0">

                  <p onClick={()=>{navigate('/qoutation', {state:quotation._id})}} className="truncate text-sm font-bold text-gray-900">
                    {quotation.quotationNumber}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    Quotation
                  </p>

                </div>

              </div>

            </td>

            {/* CLIENT */}
            <td className="px-5 py-4">

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-gray-900">
                  {quotation.clientName}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {quotation.clientEmail}
                </p>

              </div>

            </td>

            {/* PROJECT */}
            <td className="px-5 py-4">

              <p
                title={quotation.project}
                className="
                  max-w-[250px]
                  truncate
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {quotation.project}
              </p>

            </td>

            {/* DATE */}
            <td className="whitespace-nowrap px-5 py-4">
              <p className="text-sm text-gray-700">
                {quotation.date}
              </p>
            </td>

            {/* VALID UNTIL */}
            <td className="whitespace-nowrap px-5 py-4">
              <p className="text-sm text-gray-700">
                {quotation.validUntil}
              </p>
            </td>

            {/* AMOUNT */}
            <td className="whitespace-nowrap px-5 py-4 text-right">

              <p className="text-sm font-bold text-gray-900">
                ₹{formatPrice(quotation.amount)}
              </p>

            </td>

            {/* ACTIONS */}
            <td
              className="
                sticky
                right-0
                z-20
                w-[80px]
                bg-white
                px-3
                py-4
                align-middle
                shadow-[-5px_0_10px_-8px_rgba(0,0,0,0.35)]
              "
            >

              <div
                className="
                  relative
                  flex
                  items-center
                  justify-center
                "
              >

                {/* THREE DOT BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenActionId((current) =>
                      current === quotation._id
                        ? null
                        : quotation._id
                    );
                  }}
                  title="Actions"
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-lg
                    text-gray-500
                    transition
                    hover:bg-violet-100
                    hover:text-violet-600
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-200
                  "
                >
                  <MoreVertical size={19} />
                </button>

                {/* ACTION DROPDOWN */}
                {openActionId === quotation._id && (

                  <div
                    className="
                      absolute
                      right-0
                      top-11
                      z-[100]
                      w-36
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-1.5
                      shadow-xl
                    "
                  >

                    {/* VIEW */}
                    <button
                      type="button"
                      onClick={() => {
                       
                        navigate('/qoutation',{state:quotation._id})
                        console.log(
                          "View:",
                          quotation._id
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-blue-50
                        hover:text-blue-600
                      "
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>

                <button
  type="button"
  onClick={(e) => {
   
  

    navigate("/edit-qoutation", {
      state: quotation._id,
    });
  }}
  className="
    flex
    w-full
    items-center
    gap-3
    rounded-lg
    px-3
    py-2.5
    text-left
    text-sm
    font-medium
    text-gray-700
    transition
    hover:bg-violet-50
    hover:text-violet-600
  "
>
  <Pencil size={16} />
  <span>Edit</span>
</button>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpenActionId(null);
                        console.log(
                          "Delete:",
                          quotation._id
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                      "
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>

                  </div>
                )}

              </div>

            </td>

          </tr>

        ))

      ) : (

        /* EMPTY STATE */
        <tr>
          <td
            colSpan={7}
            className="px-5 py-16 text-center"
          >

            <div className="flex flex-col items-center">

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-violet-50
                  text-violet-500
                "
              >
                <FileText size={28} />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-900">
                No quotations found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or create a new quotation.
              </p>

              <button
                onClick={() => {
                 
                }}
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-violet-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-violet-700
                "
              >
                <Plus size={16} />
                Create Quotation
              </button>

            </div>

          </td>
        </tr>

      )}

    </tbody>

  </table>
</div>

</div>

     
      </div>

    </div>
  );
};

export default AllQuotation;
