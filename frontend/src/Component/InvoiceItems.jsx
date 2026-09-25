import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Package,
  StickyNote,
  ChevronDown,
  Save,
} from "lucide-react";

import { toast } from "react-toastify";

import { InvoiceContext } from "../Context/InvoiceContext";

/* ============================================================
   DEFAULT ITEM
   ============================================================ */

const emptyItem = {
  description: "",
  quantity: 1,
  rate: "",
  tax: 0,
  discount: 0,
  notes: [],
};

/* ============================================================
   NORMALIZE NOTES
   ============================================================ */

const normalizeNotes = (notes) => {
  if (!notes) {
    return [];
  }

  if (Array.isArray(notes)) {
    return notes
      .map((note) => {
        if (typeof note === "string") {
          return note;
        }

        if (typeof note === "object" && note !== null) {
          return (
            note.text ||
            note.note ||
            note.description ||
            ""
          );
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof notes === "string") {
    return notes.trim() ? [notes.trim()] : [];
  }

  return [];
};

/* ============================================================
   NORMALIZE BACKEND ITEM
   ============================================================ */

const normalizeBackendItem = (item) => {
  return {
    _id: item?._id || item?.id || "",

    description:
      item?.description ||
      item?.title ||
      item?.name ||
      item?.itemName ||
      "",

    quantity: Number(item?.quantity) || 1,

    rate:
      item?.rate ??
      item?.price ??
      item?.amount ??
      "",

    tax: Number(item?.tax) || 0,

    discount: Number(item?.discount) || 0,

    notes: normalizeNotes(item?.notes),
  };
};

/* ============================================================
   CALCULATE ITEM
   ============================================================ */

const calculateItem = (item) => {
  const quantity = Number(item.quantity) || 0;
  const rate = Number(item.rate) || 0;
  const tax = Number(item.tax) || 0;
  const discount = Number(item.discount) || 0;

  const subtotal = quantity * rate;

  const discountAmount =
    subtotal * (discount / 100);

  const taxableAmount =
    subtotal - discountAmount;

  const taxAmount =
    taxableAmount * (tax / 100);

  const total =
    taxableAmount + taxAmount;

  return {
    ...item,

    quantity,
    rate,
    tax,
    discount,

    subtotal,
    discountAmount,
    taxAmount,
    total,
  };
};

/* ============================================================
   CALCULATE TOTALS
   ============================================================ */

const calculateTotals = (items) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  items.forEach((item) => {
    const calculated = calculateItem(item);

    subtotal += calculated.subtotal;
    totalDiscount += calculated.discountAmount;
    totalTax += calculated.taxAmount;
    grandTotal += calculated.total;
  });

  return {
    subtotal,
    totalDiscount,
    totalTax,
    grandTotal,
  };
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
   COMPONENT
   ============================================================ */

const InvoiceItems = ({ onItemsChange }) => {
  const { backendUrl, getCookie } =
    useContext(InvoiceContext);

  /* ==========================================================
     BACKEND ITEMS
     ========================================================== */

  const [availableItems, setAvailableItems] =
    useState([]);

  const [loadingItems, setLoadingItems] =
    useState(true);

  /* ==========================================================
     SELECTED BACKEND ITEM
     ========================================================== */

  const [selectedItemId, setSelectedItemId] =
    useState("");

  /* ==========================================================
     CURRENT ITEM
     ========================================================== */

  const [newItem, setNewItem] =
    useState(emptyItem);

  /* ==========================================================
     INVOICE ITEMS
     ========================================================== */

  const [items, setItems] = useState([]);

  /* ==========================================================
     EDIT MODE
     ========================================================== */

  const [editingIndex, setEditingIndex] =
    useState(null);

  /* ==========================================================
     NOTE INPUT
     ========================================================== */

  const [noteInput, setNoteInput] =
    useState("");

  /* ==========================================================
     FETCH SAVED ITEMS
     ========================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchItems = async () => {
      try {
        setLoadingItems(true);

        const token = getCookie("token");

        const response = await axios.get(
          `${backendUrl}/allitem`,
          {
            headers: {
              token,
            },
          }
        );

        if (!mounted) {
          return;
        }

        const backendItems =
          response.data?.allitem ||
          response.data?.data?.allitem ||
          [];

        const normalizedItems =
          Array.isArray(backendItems)
            ? backendItems.map(normalizeBackendItem)
            : [];

        setAvailableItems(normalizedItems);
      } catch (error) {
        console.error(
          "Fetch invoice items error:",
          error
        );

        if (mounted) {
          toast.error(
            error.response?.data?.message ||
              "Unable to load saved items"
          );
        }
      } finally {
        if (mounted) {
          setLoadingItems(false);
        }
      }
    };

    if (backendUrl) {
      fetchItems();
    }

    return () => {
      mounted = false;
    };
  }, [backendUrl]);

  /* ==========================================================
     UPDATE PARENT
     
     IMPORTANT:
     We call onItemsChange only when an actual item operation
     happens. There is NO useEffect watching items.
     
     This prevents:
     
     Child render
       ↓
     useEffect
       ↓
     Parent setState
       ↓
     Parent render
       ↓
     Child render
       ↓
     useEffect
       ↓
     Maximum update depth
     ========================================================== */

  const updateParent = (updatedItems) => {
    const calculatedItems =
      updatedItems.map(calculateItem);

    const totals =
      calculateTotals(calculatedItems);

    setItems(calculatedItems);

    onItemsChange(
      calculatedItems,
      totals
    );
  };

  /* ==========================================================
     SELECT SAVED ITEM
     ========================================================== */

  const handleSelectItem = (e) => {
    const itemId = e.target.value;

    setSelectedItemId(itemId);

    if (!itemId) {
      setNewItem({
        ...emptyItem,
        notes: [],
      });

      return;
    }

    const selectedItem =
      availableItems.find(
        (item) => String(item._id) === String(itemId)
      );

    if (!selectedItem) {
      return;
    }

    /*
      IMPORTANT:

      Backend notes are copied here.

      Example backend:

      notes: [
        "Ad budget will be paid separately",
        "Payment required before starting"
      ]

      They will appear in the editable notes section.
    */

    setNewItem({
      description: selectedItem.description,

      quantity:
        Number(selectedItem.quantity) || 1,

      rate:
        selectedItem.rate ?? "",

      tax:
        Number(selectedItem.tax) || 0,

      discount:
        Number(selectedItem.discount) || 0,

      notes: [
        ...normalizeNotes(selectedItem.notes),
      ],
    });
  };

  /* ==========================================================
     CURRENT ITEM CHANGE
     ========================================================== */

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;

    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ==========================================================
     ADD NOTE TO CURRENT ITEM
     ========================================================== */

  const handleAddItemNote = () => {
    const note = noteInput.trim();

    if (!note) {
      toast.error("Please enter a note");

      return;
    }

    setNewItem((prev) => ({
      ...prev,

      notes: [
        ...(prev.notes || []),
        note,
      ],
    }));

    setNoteInput("");
  };

  /* ==========================================================
     REMOVE NOTE FROM CURRENT ITEM
     ========================================================== */

  const handleRemoveItemNote = (index) => {
    setNewItem((prev) => ({
      ...prev,

      notes: (prev.notes || []).filter(
        (_, noteIndex) => noteIndex !== index
      ),
    }));
  };

  /* ==========================================================
     EDIT NOTE OF CURRENT ITEM
     ========================================================== */

  const handleEditItemNote = (
    index,
    value
  ) => {
    setNewItem((prev) => ({
      ...prev,

      notes: (prev.notes || []).map(
        (note, noteIndex) =>
          noteIndex === index
            ? value
            : note
      ),
    }));
  };

  /* ==========================================================
     ADD ITEM
     ========================================================== */

  const handleAddItem = () => {
    if (!newItem.description.trim()) {
      toast.error("Please select or enter an item");

      return;
    }

    if (
      Number(newItem.quantity) <= 0
    ) {
      toast.error("Quantity must be greater than 0");

      return;
    }

    if (
      newItem.rate === "" ||
      Number(newItem.rate) < 0
    ) {
      toast.error("Please enter a valid rate");

      return;
    }

    const itemToAdd =
      calculateItem({
        ...newItem,

        description:
          newItem.description.trim(),

        quantity:
          Number(newItem.quantity) || 1,

        rate:
          Number(newItem.rate) || 0,

        tax:
          Number(newItem.tax) || 0,

        discount:
          Number(newItem.discount) || 0,

        notes:
          normalizeNotes(newItem.notes),
      });

    updateParent([
      ...items,
      itemToAdd,
    ]);

    /* Reset form */

    setNewItem({
      ...emptyItem,
      notes: [],
    });

    setSelectedItemId("");

    setNoteInput("");

    toast.success("Item added");
  };

  /* ==========================================================
     START EDIT ITEM
     ========================================================== */

  const handleStartEdit = (index) => {
    const item = items[index];

    setEditingIndex(index);

    setNewItem({
      description:
        item.description || "",

      quantity:
        Number(item.quantity) || 1,

      rate:
        item.rate ?? "",

      tax:
        Number(item.tax) || 0,

      discount:
        Number(item.discount) || 0,

      notes: [
        ...normalizeNotes(item.notes),
      ],
    });

    setSelectedItemId(
      item._id
        ? String(item._id)
        : ""
    );

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     SAVE EDITED ITEM
     ========================================================== */

  const handleSaveEdit = () => {
    if (!newItem.description.trim()) {
      toast.error("Item description is required");

      return;
    }

    if (
      Number(newItem.quantity) <= 0
    ) {
      toast.error("Quantity must be greater than 0");

      return;
    }

    if (
      newItem.rate === "" ||
      Number(newItem.rate) < 0
    ) {
      toast.error("Please enter a valid rate");

      return;
    }

    if (editingIndex === null) {
      return;
    }

    const updatedItem =
      calculateItem({
        ...newItem,

        description:
          newItem.description.trim(),

        quantity:
          Number(newItem.quantity) || 1,

        rate:
          Number(newItem.rate) || 0,

        tax:
          Number(newItem.tax) || 0,

        discount:
          Number(newItem.discount) || 0,

        notes:
          normalizeNotes(newItem.notes),
      });

    const updatedItems =
      items.map((item, index) =>
        index === editingIndex
          ? {
              ...item,
              ...updatedItem,
            }
          : item
      );

    updateParent(updatedItems);

    setEditingIndex(null);

    setNewItem({
      ...emptyItem,
      notes: [],
    });

    setSelectedItemId("");

    setNoteInput("");

    toast.success("Item updated");
  };

  /* ==========================================================
     CANCEL EDIT
     ========================================================== */

  const handleCancelEdit = () => {
    setEditingIndex(null);

    setNewItem({
      ...emptyItem,
      notes: [],
    });

    setSelectedItemId("");

    setNoteInput("");

    window.scrollTo({
      top:
        document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     REMOVE ITEM
     ========================================================== */

  const handleRemoveItem = (index) => {
    const updatedItems =
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    updateParent(updatedItems);

    if (
      editingIndex === index
    ) {
      handleCancelEdit();
    }

    toast.success("Item removed");
  };

  /* ==========================================================
     PREVIEW CURRENT ITEM TOTAL
     ========================================================== */

  const currentItem =
    calculateItem(newItem);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <section className="rounded-2xl border border-violet-100 bg-white shadow-sm">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Package size={18} />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Invoice Items
            </h2>

            <p className="text-xs text-slate-400">
              Select saved items and add them to your invoice
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-violet-50 px-3 py-2 text-xs font-bold text-violet-600">
          {items.length}{" "}
          {items.length === 1
            ? "Item"
            : "Items"}
        </div>
      </div>

      {/* ======================================================
          ITEM FORM
          ====================================================== */}

      <div className="border-b border-violet-100 bg-slate-50/60 p-5">
        {/* ====================================================
            SAVED ITEM DROPDOWN
            ==================================================== */}

        <div>
          <label className="mb-2 block text-xs font-bold text-slate-600">
            Select Saved Item
          </label>

          <div className="relative">
            <select
              value={selectedItemId}
              onChange={handleSelectItem}
              disabled={loadingItems}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {loadingItems
                  ? "Loading saved items..."
                  : availableItems.length === 0
                  ? "No saved items found"
                  : "Select an item"}
              </option>

              {availableItems.map(
                (item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.description ||
                      "Unnamed Item"}
                  </option>
                )
              )}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Selecting an item only fills the form. Click{" "}
            <span className="font-semibold text-violet-500">
              Add Item
            </span>{" "}
            to add it to the invoice.
          </p>
        </div>

        {/* ====================================================
            ITEM DETAILS
            ==================================================== */}

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* DESCRIPTION */}

          <div className="lg:col-span-2">
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Item Description
            </label>

            <input
              type="text"
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
              placeholder="Item description"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* QUANTITY */}

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              name="quantity"
              value={newItem.quantity}
              onChange={handleNewItemChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* RATE */}

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Rate
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              name="rate"
              value={newItem.rate}
              onChange={handleNewItemChange}
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* DISCOUNT */}

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Discount %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              name="discount"
              value={newItem.discount}
              onChange={handleNewItemChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />
          </div>

          {/* TAX */}

          <div>
            <label className="mb-2 block text-xs font-bold text-slate-600">
              Tax %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              name="tax"
              value={newItem.tax}
              onChange={handleNewItemChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />
          </div>
        </div>

        {/* ====================================================
            ITEM NOTES
            ==================================================== */}

        <div className="mt-5 rounded-2xl border border-violet-100 bg-white p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <StickyNote size={15} />
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-700">
                Item Notes
              </h3>

              <p className="text-[11px] text-slate-400">
                Notes from the saved item can be edited here.
              </p>
            </div>
          </div>

          {/* EXISTING NOTES */}

          <div className="mt-4 space-y-2">
            {newItem.notes &&
            newItem.notes.length > 0 ? (
              newItem.notes.map(
                (note, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded-xl bg-violet-50/60 p-2"
                  >
                    <span className="mt-2 w-5 shrink-0 text-center text-[11px] font-bold text-violet-500">
                      {index + 1}
                    </span>

                    <textarea
                      value={note}
                      onChange={(e) =>
                        handleEditItemNote(
                          index,
                          e.target.value
                        )
                      }
                      rows={2}
                      className="min-h-[60px] flex-1 resize-none rounded-lg border border-violet-100 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItemNote(
                          index
                        )
                      }
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                      title="Remove note"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              )
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-4 text-center">
                <p className="text-[11px] text-slate-400">
                  No notes for this item
                </p>
              </div>
            )}
          </div>

          {/* ADD NOTE */}

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={noteInput}
              onChange={(e) =>
                setNoteInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  handleAddItemNote();
                }
              }}
              placeholder="Add item note..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50"
            />

            <button
              type="button"
              onClick={handleAddItemNote}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-violet-50 hover:text-violet-600"
            >
              <Plus size={14} />
              Add Note
            </button>
          </div>
        </div>

        {/* ====================================================
            CURRENT ITEM PREVIEW
            ==================================================== */}

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-violet-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Item Total
            </p>

            <p className="mt-1 text-xl font-black text-violet-700">
              ₹{formatMoney(currentItem.total)}
            </p>
          </div>

          <div className="flex gap-2">
            {editingIndex !== null ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs font-semibold text-white hover:bg-violet-700"
              >
                <Plus size={16} />
                Add Item
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================
          ADDED ITEMS
          ====================================================== */}

      <div className="p-5">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-12 text-center">
            <Package
              size={28}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 text-sm font-bold text-slate-600">
              No items added
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Select a saved item above and click Add Item.
            </p>
          </div>
        ) : (
          <>
            {/* ==================================================
                DESKTOP TABLE
                ================================================== */}

            <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Item
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Qty
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Rate
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Discount
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Tax
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {items.map(
                    (item, index) => {
                      const calculated =
                        calculateItem(item);

                      return (
                        <tr
                          key={`${item._id || "item"}-${index}`}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          {/* ITEM */}

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-700">
                                {
                                  item.description
                                }
                              </p>

                              {item.notes &&
                              item.notes.length >
                                0 ? (
                                <div className="mt-2 space-y-1">
                                  {item.notes.map(
                                    (
                                      note,
                                      noteIndex
                                    ) => (
                                      <div
                                        key={
                                          noteIndex
                                        }
                                        className="flex items-start gap-1.5"
                                      >
                                        <StickyNote
                                          size={
                                            11
                                          }
                                          className="mt-0.5 shrink-0 text-violet-400"
                                        />

                                        <span className="text-[10px] leading-4 text-slate-400">
                                          {
                                            note
                                          }
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </td>

                          {/* QUANTITY */}

                          <td className="px-4 py-4 text-center text-sm text-slate-600">
                            {
                              calculated.quantity
                            }
                          </td>

                          {/* RATE */}

                          <td className="px-4 py-4 text-right text-sm text-slate-600">
                            ₹
                            {formatMoney(
                              calculated.rate
                            )}
                          </td>

                          {/* DISCOUNT */}

                          <td className="px-4 py-4 text-right text-sm text-rose-500">
                            {calculated.discount}
                            %
                          </td>

                          {/* TAX */}

                          <td className="px-4 py-4 text-right text-sm text-violet-600">
                            {calculated.tax}
                            %
                          </td>

                          {/* TOTAL */}

                          <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">
                            ₹
                            {formatMoney(
                              calculated.total
                            )}
                          </td>

                          {/* ACTION */}

                          <td className="px-4 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartEdit(
                                    index
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100"
                                title="Edit item"
                              >
                                <Edit3
                                  size={14}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveItem(
                                    index
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100"
                                title="Remove item"
                              >
                                <Trash2
                                  size={14}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* ==================================================
                MOBILE CARDS
                ================================================== */}

            <div className="space-y-3 md:hidden">
              {items.map(
                (item, index) => {
                  const calculated =
                    calculateItem(item);

                  return (
                    <div
                      key={`${item._id || "item"}-mobile-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-bold text-slate-700">
                            {
                              item.description
                            }
                          </h3>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Qty{" "}
                            {
                              calculated.quantity
                            }{" "}
                            × ₹
                            {formatMoney(
                              calculated.rate
                            )}
                          </p>
                        </div>

                        <p className="shrink-0 text-base font-black text-violet-700">
                          ₹
                          {formatMoney(
                            calculated.total
                          )}
                        </p>
                      </div>

                      {/* DETAILS */}

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-slate-50 p-2">
                          <p className="text-[9px] uppercase text-slate-400">
                            Discount
                          </p>

                          <p className="mt-1 text-xs font-bold text-rose-500">
                            {
                              calculated.discount
                            }
                            %
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2">
                          <p className="text-[9px] uppercase text-slate-400">
                            Tax
                          </p>

                          <p className="mt-1 text-xs font-bold text-violet-600">
                            {
                              calculated.tax
                            }
                            %
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2">
                          <p className="text-[9px] uppercase text-slate-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-700">
                            ₹
                            {formatMoney(
                              calculated.subtotal
                            )}
                          </p>
                        </div>
                      </div>

                      {/* NOTES */}

                      {item.notes &&
                      item.notes.length >
                        0 ? (
                        <div className="mt-4 rounded-xl bg-violet-50/60 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <StickyNote
                              size={13}
                              className="text-violet-500"
                            />

                            <span className="text-[10px] font-bold uppercase tracking-wide text-violet-500">
                              Notes
                            </span>
                          </div>

                          <div className="space-y-1">
                            {item.notes.map(
                              (
                                note,
                                noteIndex
                              ) => (
                                <p
                                  key={
                                    noteIndex
                                  }
                                  className="text-[11px] leading-4 text-slate-500"
                                >
                                  {noteIndex +
                                    1}
                                  . {note}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ) : null}

                      {/* ACTIONS */}

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleStartEdit(
                              index
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 text-xs font-semibold text-violet-600 hover:bg-violet-100"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveItem(
                              index
                            )
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-500 hover:bg-rose-100"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InvoiceItems;