import React, { useContext, useState } from "react";
import {
  ArrowLeft,
  Package,
  FileText,
  IndianRupee,
  StickyNote,
  Save,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import { InvoiceContext } from "../Context/InvoiceContext";
import { toast } from "react-toastify";

const AddItem = () => {
  const [item, setItem] = useState({
    title: "",
    price: "",
    notes: [],
  });

  const [note, setNote] = useState("");
  const{backendUrl,getCookie, navigate}=useContext(InvoiceContext)

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  // Add note to notes array
  const addNote = () => {
    if (note.trim() === "") return;

    setItem({
      ...item,
      notes: [...item.notes, note.trim()],
    });

    setNote("");
  };

  // Remove note from notes array
  const removeNote = (index) => {
    setItem({
      ...item,
      notes: item.notes.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(item)
    let token =getCookie('token')
     const response=await axios.post(`${backendUrl}/createitem`,{"title":item.title, "price":item.price, "notes":item.notes}, {headers:{token}})
     if(response.data.success == true ){
        toast.success("item added successfully ")
        navigate('/allitem')
        
     }
     console.log(response)
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">

          <button
            type="button"
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-violet-600"
          >
            <ArrowLeft size={17} />
            Back to Items
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
              <Package size={21} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                Item Management
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Add Item
              </h1>
            </div>

          </div>

          <p className="mt-2 text-sm text-gray-500">
            Add a reusable item for your invoices.
          </p>
        </div>


        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-[0_8px_30px_rgba(124,58,237,0.07)]">

            {/* Section Header */}
            <div className="border-b border-violet-50 bg-gradient-to-r from-violet-50/70 to-white px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Item Details
                  </h2>

                  <p className="text-xs text-gray-500">
                    Enter the details of your new item
                  </p>
                </div>

              </div>

            </div>


            {/* Form Fields */}
            <div className="space-y-6 p-6">

              {/* Item Title */}
              <div>

                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <FileText size={14} className="text-violet-500" />
                  Item Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={item.title}
                  onChange={handleChange}
                  placeholder="e.g. Website Development"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                />

              </div>


              {/* Price */}
              <div>

                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <IndianRupee size={14} className="text-violet-500" />
                  Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                  />

                </div>

              </div>


              {/* Notes */}
              <div>

                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <StickyNote size={14} className="text-violet-500" />
                  Notes
                </label>

                {/* Add Note */}
                <div className="flex gap-2">

                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNote();
                      }
                    }}
                    placeholder="Enter a note"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-50"
                  />

                  <button
                    type="button"
                    onClick={addNote}
                    className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
                  >
                    <Plus size={17} />
                    <span className="hidden sm:block">Add</span>
                  </button>

                </div>


                {/* Notes List */}
                {item.notes.length > 0 && (
                  <div className="mt-4 space-y-2">

                    {item.notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 rounded-xl border border-violet-100 bg-violet-50/60 px-4 py-3"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
                            {index + 1}
                          </span>

                          <p className="truncate text-sm text-gray-700">
                            {note}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() => removeNote(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white hover:text-red-500"
                        >
                          <X size={16} />
                        </button>

                      </div>
                    ))}

                  </div>
                )}

                <p className="mt-2 text-xs text-gray-400">
                  Add as many notes as you need.
                </p>

              </div>

            </div>


            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/50 p-5 sm:flex-row sm:justify-end">

           

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 hover:shadow-violet-300"
              >
                <Save size={17} />
                Save Item
              </button>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddItem;