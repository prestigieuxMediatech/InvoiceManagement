
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
import AllInvoiceSkeleton from "./AllInvoiceSkeleton";
import { toast } from "react-toastify";

const AllQuotation = () => {
  const [search, setSearch] = useState("");
  const{backendUrl, getCookie,navigate}=useContext(InvoiceContext)
  const token=getCookie("token")
  const [quotations, setQuotations] = useState([]);
  const [openActionId, setOpenActionId] = useState(null);

  const[loading, setLoading]=useState(false)


// get ALL Qoutation from backend 
const getQoutation = async () => {
  try {
    setLoading(true)
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
    setLoading(false)
  } catch (e) {
    setLoading(false)
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

  

// Delete Qoutation
const deleteQoutation=async(id)=>{
  try{
    const response=await axios.delete(`${backendUrl}/delete-qoutation/${id}`, {headers:{token}})
    console.log(response)
    if (response.data.success == true){
      toast.success("invoice deleted successfully ")
       window.location.reload()
    }
  }
  catch(e){
    console.log(e.message)
    toast.error(e.message)
  }
}
 

  return (

    loading ? (<AllInvoiceSkeleton/>)
    :(
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

<div className="w-full overflow-x-auto rounded-xl border border-gray-200">
  <table className="w-full min-w-[800px] border-collapse">

    {/* ================= TABLE HEADER ================= */}
    <thead>
      <tr className="bg-violet-600 text-left text-xs font-bold uppercase tracking-wide text-white">

        {/* QUOTATION */}
        <th className="w-[220px] min-w-[220px] px-4 py-4 sm:px-5">
          Quotation
        </th>

        {/* PROJECT */}
        <th className="w-[300px] min-w-[300px] px-4 py-4 sm:px-5">
          Project
        </th>

        {/* DATE */}
        <th className="w-[150px] min-w-[150px] whitespace-nowrap px-4 py-4 sm:px-5">
          Date
        </th>

        {/* AMOUNT */}
        <th className="w-[170px] min-w-[170px] whitespace-nowrap px-4 py-4 text-right sm:px-5">
          Amount
        </th>

        {/* ACTIONS */}
        <th
          className="
            sticky
            right-0
          
            w-[70px]
            min-w-[70px]
            bg-violet-600
            px-2
            py-4
            text-center
            sm:w-[80px]
            sm:min-w-[80px]
            sm:px-3
          "
        >
          Actions
        </th>

      </tr>
    </thead>


    {/* ================= TABLE BODY ================= */}
    <tbody>

      {filteredQuotations.length > 0 ? (

        filteredQuotations.map((quotation) => (

          <tr
            key={quotation._id}
            className="
              cursor-pointer
              border-b
              border-gray-100
              bg-white
              transition
              hover:bg-violet-50/40
            "
          >

            {/* ================= QUOTATION ================= */}
            <td className="w-[220px] min-w-[220px] px-4 py-4 sm:px-5">

              <div className="flex min-w-0 items-center gap-3">

                {/* ICON */}
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-violet-100
                    text-violet-600
                    sm:h-10
                    sm:w-10
                  "
                >
                  <FileText size={18} />
                </div>

                {/* DETAILS */}
                <div className="min-w-0">

                  <p
                    onClick={(e) => {
                      e.stopPropagation();

                      navigate("/qoutation", {
                        state: quotation._id,
                      });
                    }}
                    className="
                      cursor-pointer
                      truncate
                      text-sm
                      font-bold
                      text-gray-900
                      hover:text-violet-600
                    "
                  >
                    {quotation.quotationNumber}
                  </p>

                  <p className="text-[11px] text-gray-400">
                    Quotation
                  </p>

                </div>

              </div>

            </td>


            {/* ================= PROJECT ================= */}
            <td className="w-[300px] min-w-[300px] px-4 py-4 sm:px-5">

              <p
                title={quotation.project}
                className="
                  max-w-[280px]
                  truncate
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {quotation.project}
              </p>

            </td>


            {/* ================= DATE ================= */}
            <td
              className="
                w-[150px]
                min-w-[150px]
                whitespace-nowrap
                px-4
                py-4
                sm:px-5
              "
            >
              <p className="text-sm text-gray-700">
                {quotation.date}
              </p>
            </td>


            {/* ================= AMOUNT ================= */}
            <td
              className="
                w-[170px]
                min-w-[170px]
                whitespace-nowrap
                px-4
                py-4
                text-right
                sm:px-5
              "
            >
              <p className="text-sm font-bold text-gray-900">
                ₹{formatPrice(quotation.amount)}
              </p>
            </td>


            {/* ================= ACTIONS ================= */}
            <td
              className="
                sticky
                right-0
                z-20
                w-[70px]
                min-w-[70px]
                bg-white
                px-2
                py-3
                align-middle
                shadow-[-5px_0_10px_-8px_rgba(0,0,0,0.35)]
                sm:w-[80px]
                sm:min-w-[80px]
                sm:px-3
                sm:py-4
              "
            >

              <div className="relative flex items-center justify-center">

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
                    h-8
                    w-8
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
                    sm:h-9
                    sm:w-9
                  "
                >
                  <MoreVertical size={18} />
                </button>


                {/* ================= ACTION DROPDOWN ================= */}
                {openActionId === quotation._id && (

                  <div
                    className="
                      absolute
                      right-0
                      
                      sm:fixed
                      sm:right-3
                      z-[100]
                      w-32
                    
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-1
                      shadow-xl
                     
                      sm:w-36
                    "
                  >

                    {/* VIEW */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenActionId(null);

                        navigate("/qoutation", {
                          state: quotation._id,
                        });
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-2.5
                        py-2.5
                        text-left
                        text-xs
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-blue-50
                        hover:text-blue-600
                        sm:gap-3
                        sm:px-3
                        sm:text-sm
                      "
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>


                    {/* EDIT */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenActionId(null);

                        navigate("/edit-qoutation", {
                          state: quotation._id,
                        });
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-2.5
                        py-2.5
                        text-left
                        text-xs
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-violet-50
                        hover:text-violet-600
                        sm:gap-3
                        sm:px-3
                        sm:text-sm
                      "
                    >
                      <Pencil size={15} />
                      <span>Edit</span>
                    </button>


                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();

                        setOpenActionId(null);

                        deleteQoutation(quotation._id);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-lg
                        px-2.5
                        py-2.5
                        text-left
                        text-xs
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-red-50
                        hover:text-red-600
                        sm:gap-3
                        sm:px-3
                        sm:text-sm
                      "
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>

                  </div>

                )}

              </div>

            </td>

          </tr>

        ))

      ) : (

        /* ================= EMPTY STATE ================= */
        <tr>

          <td
            colSpan={5}
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
                onClick={() => navigate("/createqoutation")}
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
    )
  );
};

export default AllQuotation;
