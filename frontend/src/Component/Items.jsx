import React, { useContext, useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Package,
  FileText,
} from "lucide-react";
import { InvoiceContext } from "../Context/InvoiceContext";
import axios from "axios";
import { toast } from "react-toastify";

const Items = () => {
  const [search, setSearch] = useState("");
  const {navigate, backendUrl, getCookie}=useContext(InvoiceContext)
  const [items, setItems] = useState([
   
  ]);

  // Search items
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // Delete item
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

 useEffect(()=>{
const getItem=async()=>{
  try{
    let token=getCookie('token')
  const response= await axios.get(`${backendUrl}/allitem`,{headers:{token}})
  setItems(response.data?.allitem)
  }
  catch(e){
    console.log(e.message)
  }
}

getItem()
 },[])



//delete item 
const  deleteItem= async(id)=>{
  try{
    let token=getCookie('token')
        const response=await axios.delete(`${backendUrl}/deleteitem/${id}`, {headers:{token}})
        if(response.data.success ===true){
          toast.success(" item deleted successfully ")
          window.location.reload()
        }
  }
  catch(e){
    console.log(e.message)
    toast.error(e.message)
  }
} 
  return (
    <div className="min-h-screen bg-[#faf9ff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                <Package size={21} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Invoice Management
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  Items
                </h1>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Manage your frequently used invoice items.
            </p>
          </div>

          {/* Add Item */}
          <button
          onClick={()=>{
            navigate('/additem')
          }}
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-violet-300"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>


        {/* ================= MAIN CARD ================= */}
        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(124,58,237,0.06)]">

          {/* ================= TOOLBAR ================= */}
          <div className="flex flex-col gap-4 border-b border-violet-50 bg-gradient-to-r from-violet-50/60 to-white p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-semibold text-gray-900">
                Invoice Items
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {items.length} items available
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
              />
            </div>
          </div>


          {/* ================= TABLE ================= */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              {/* Table Header */}
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Item
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Notes
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>


              {/* Table Body */}
              <tbody className="divide-y divide-gray-100">

                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition hover:bg-violet-50/30"
                    >

                      {/* Item */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                            <FileText size={18} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900 ">
                              {item.title}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Item #{String(item.id).padStart(3, "0")}
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* Price */}
                      <td className="px-6 py-5">

                        <span className="font-semibold text-gray-900">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>

                      </td>


                      {/* Notes */}
                      <td className="px-6 py-5">

                        {item.notes.length > 0 ? (
                          <div className="flex flex-wrap gap-2">

                            {item.notes.slice(0, 2).map((note, index) => (
                              <span
                                key={index}
                                className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600"
                              >
                                {note}
                              </span>
                            ))}

                            {item.notes.length > 2 && (
                              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                +{item.notes.length - 2}
                              </span>
                            )}

                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">
                            No notes
                          </span>
                        )}

                      </td>


                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-2">

                          

                          <button
                            type="button"
                            onClick={() => deleteItem(item._id)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (

                  /* Empty State */
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
                        <Search size={20} />
                      </div>

                      <h3 className="mt-4 font-semibold text-gray-900">
                        No items found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try searching with a different item name.
                      </p>
                    </td>
                  </tr>

                )}

              </tbody>

            </table>
          </div>


          {/* ================= FOOTER ================= */}
          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">

            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-700">
                {filteredItems.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {items.length}
              </span>{" "}
              items
            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Items;