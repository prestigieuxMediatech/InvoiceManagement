import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

import assets from "../assets/assets";
import { toast } from "react-toastify";
import { InvoiceContext } from "../Context/InvoiceContext";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { sendInvoiceWhatsApp } from "../sendFunctions";

window.html2canvas = html2canvas;

const InvoiceTemplate2 = () => {
  const { backendUrl, getCookie , wLoading, setWLoading} =
    useContext(InvoiceContext);

  const location = useLocation();

  /* =====================================================
      DUMMY INVOICE DATA

      Used when:
      1. Backend returns no data
      2. API request fails
      3. No invoice ID is available
  ====================================================== */

  const dummyInvoiceData = {
    Baddress:
      "imaat manzil kausa mumbra thane maharashtra room no 03 near noor hospital",

    BbusinessName: "ibaad",

    Bemail: "ibaad@gmail.com",

    Bphone: "7208757995",

    Caddress:
      "imaat manzil kausa mumbra thane maharashtra room no 03 near noor hospital",

    CbusinessName: "salman",

    Cemail: "salman@gmail.com",

    Cphone: "7208797885",

    additionalInfo: [],

    date: "2026-09-16",

    dueDate: "2026-09-18",

    grandTotal: 4000,

    invoiceNumber: "INV-2915",

    item: [
      {
        id: 1789554739906,
        description: "website development",
        quantity: 1,
        rate: 4000,
        tax: 0,
        discount: 0,

        // ONLY ITEM NOTES
        notes: [
          "Website development service note",
        ],
      },
    ],

    status: "unpaid",

    subtotal: 4000,

    template: "template2",

    _id: "dummy-invoice-id",
  };

  /* =====================================================
      INVOICE DATA
  ====================================================== */

  const [invoiceData, setInvoiceData] =
    useState(null);

  /* =====================================================
      GET INVOICE
  ====================================================== */

  const getInvoice = async () => {
    try {
      const token = getCookie("token");

      console.log(
        "Invoice ID:",
        location.state
      );

      const response = await axios.get(
        `${backendUrl}/invoice?id=${location.state}`,
        {
          headers: {
            token,
          },
        }
      );

      console.log(
        "Invoice Response:",
        response.data?.data
      );

      /* =================================================
          BACKEND DATA EXISTS
      ================================================== */

      if (response.data?.data) {
        setInvoiceData(
          response.data.data
        );

        console.log(
          "Using backend invoice data"
        );
      }

      /* =================================================
          BACKEND DATA DOES NOT EXIST
      ================================================== */

      else {
        console.log(
          "No invoice data found. Using dummy data."
        );

        setInvoiceData(
          dummyInvoiceData
        );
      }
    } catch (error) {
      console.error(
        "Invoice Error:",
        error
      );

      console.log(
        "Using dummy invoice data."
      );

      setInvoiceData(
        dummyInvoiceData
      );

      toast.info(
        "Backend invoice unavailable. Showing demo invoice."
      );
    }
  };

  /* =====================================================
      FETCH INVOICE
  ====================================================== */

  useEffect(() => {
    if (location.state) {
      getInvoice();
    } else {
      console.log(
        "No invoice ID found. Using dummy data."
      );

      setInvoiceData(
        dummyInvoiceData
      );
    }
  }, [location.state]);

  /* =====================================================
      INVOICE ITEMS
  ====================================================== */

  const invoiceItems =
    invoiceData?.item || [];

  /* =====================================================
      ITEM NOTES

      Notes are taken ONLY from:

      invoiceData.item[].notes

      Example backend:

      item: [
        {
          description: "apna website services",
          notes: [
            "cjdocjdocjdiocjdiocj jkcndkcndkcn"
          ]
        }
      ]

      Result:

      [
        "cjdocjdocjdiocjdiocj jkcndkcndkcn"
      ]
  ====================================================== */

  const itemNotes =
    invoiceItems.flatMap((item) => {
      if (!Array.isArray(item?.notes)) {
        return [];
      }

      return item.notes
        .map((note) => {
          /* If note is a string */

          if (
            typeof note === "string"
          ) {
            return note.trim();
          }

          /* If note is an object */

          if (
            typeof note === "object" &&
            note !== null
          ) {
            return note.text?.trim() || "";
          }

          return "";
        })
        .filter(Boolean);
    });

  /* =====================================================
      TAX CALCULATION

      Supports:
      quantity
      rate
      discount
      tax
  ====================================================== */

  const invoiceTax =
    invoiceItems.reduce(
      (total, item) => {
        const quantity =
          Number(
            item.quantity || 1
          );

        const rate =
          Number(
            item.rate || 0
          );

        const discount =
          Number(
            item.discount || 0
          );

        const tax =
          Number(
            item.tax || 0
          );

        const subtotal =
          quantity * rate;

        const discountAmount =
          (subtotal * discount) /
          100;

        const taxableAmount =
          subtotal -
          discountAmount;

        const taxAmount =
          (taxableAmount * tax) /
          100;

        return (
          total + taxAmount
        );
      },
      0
    );

  /* =====================================================
      RESPONSIVE SCALE

      Original invoice:
      Width  = 794px
      Height = 1000px
  ====================================================== */

  const [scale, setScale] =
    useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth =
        window.innerWidth;

      const sidePadding = 24;

      const invoiceWidth = 794;

      const availableWidth =
        screenWidth -
        sidePadding;

      const newScale =
        Math.min(
          1,
          availableWidth /
            invoiceWidth
        );

      setScale(newScale);
    };

    updateScale();

    window.addEventListener(
      "resize",
      updateScale
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateScale
      );
    };
  }, []);

  /* =====================================================
      FORMAT DATE
  ====================================================== */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  /* =====================================================
      DOWNLOAD INVOICE
  ====================================================== */

  const downloadInvoice =
    async () => {
      try {
        const invoice =
          document.getElementById(
            "invoice"
          );

        if (!invoice) {
          throw new Error(
            "Invoice element not found"
          );
        }

        /* -----------------------------------------------
            Save current transform
        ------------------------------------------------ */

        const originalTransform =
          invoice.style.transform;

        /* -----------------------------------------------
            Remove responsive scaling
        ------------------------------------------------ */

        invoice.style.transform =
          "none";

        /* -----------------------------------------------
            Give browser time to render
        ------------------------------------------------ */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              100
            )
        );

        /* -----------------------------------------------
            Capture invoice
        ------------------------------------------------ */

        const canvas =
          await html2canvas(
            invoice,
            {
              scale: 2,
              useCORS: true,
              allowTaint: false,
              backgroundColor:
                "#ffffff",
              logging: false,

              width: 794,
              height: 1000,

              windowWidth: 794,
              windowHeight: 1000,
            }
          );

        /* -----------------------------------------------
            Restore responsive scaling
        ------------------------------------------------ */

        invoice.style.transform =
          originalTransform;

        /* -----------------------------------------------
            Convert canvas to image
        ------------------------------------------------ */

        const imgData =
          canvas.toDataURL(
            "image/jpeg",
            1.0
          );

        /* -----------------------------------------------
            Create A4 PDF
        ------------------------------------------------ */

        const pdf =
          new jsPDF({
            orientation:
              "portrait",
            unit: "mm",
            format: "a4",
          });

        const pageWidth = 210;
        const pageHeight = 297;

        /* -----------------------------------------------
            Add invoice to full A4
        ------------------------------------------------ */

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST"
        );

        /* -----------------------------------------------
            Download PDF
        ------------------------------------------------ */

        pdf.save(
          `${
            invoiceData?.invoiceNumber ||
            "Invoice"
          }.pdf`
        );
      } catch (error) {
        console.error(
          "Failed to download invoice:",
          error
        );

        /* -----------------------------------------------
            Restore scale if something goes wrong
        ------------------------------------------------ */

        const invoice =
          document.getElementById(
            "invoice"
          );

        if (invoice) {
          invoice.style.transform =
            `scale(${scale})`;
        }

        toast.error(
          "Failed to download invoice"
        );
      }
    };



    const handleSendWhatsApp = () => {
      const token=getCookie('token')
      console.log(invoiceData.Cphone)
      sendInvoiceWhatsApp({
        setWLoading,
        token,
        backendUrl,
        invoiceData,
        toast,
      });
    };

  /* =====================================================
      LOADING
  ====================================================== */

  if (!invoiceData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-200">
        <p className="text-sm text-gray-600">
          Loading invoice...
        </p>
      </div>
    );
  }

  /* =====================================================
      RENDER
  ====================================================== */

  return (
    <>
      {/* =====================================================
          PRINT STYLES
      ====================================================== */}

     <style>
  {`
    @media print {

      @page {
        size: A4 portrait;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .invoice-container {
        width: 794px !important;
        height: 1000px !important;
        min-height: 1000px !important;
        padding: 0 !important;
        margin: 0 !important;
        background: #ffffff !important;
        overflow: hidden !important;
      }

      .invoice-container > div:first-child {
        width: 794px !important;
        height: 1000px !important;
        margin: 0 !important;
      }

      #invoice {
        width: 794px !important;
        height: 1000px !important;

        min-width: 794px !important;
        max-width: 794px !important;

        min-height: 1000px !important;
        max-height: 1000px !important;

        transform: none !important;
        transform-origin: top left !important;

        margin: 0 !important;
        padding: 0 !important;

        box-shadow: none !important;
        overflow: hidden !important;
      }

      #invoice svg,
      #invoice path {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .invoice-print-button {
        display: none !important;
      }
    }
  `}
</style>

      {/* =====================================================
          PAGE BACKGROUND
      ====================================================== */}

      <div
        className="
          invoice-container
          min-h-screen
          w-full
          overflow-x-hidden
          bg-gray-200
          py-4
          sm:py-10
          print:bg-white
          print:p-0
        "
      >
        {/* =====================================================
            RESPONSIVE INVOICE WRAPPER
        ====================================================== */}

        <div
          className="mx-auto"
          style={{
            width: `${794 * scale}px`,
            height: `${1000 * scale}px`,
          }}
        >
          {/* =====================================================
              INVOICE PAGE
          ====================================================== */}

          <div
            id="invoice"
            className="
              relative
              h-[1000px]
              w-[794px]
              origin-top-left
              overflow-hidden
              bg-white
              font-sans
              text-[#555]
              shadow-xl

              print:h-[250mm]
              print:w-[210mm]
              print:max-w-none
              print:shadow-none
            "
            style={{
              transform: `scale(${scale})`,
              transformOrigin:
                "top left",
            }}
          >
            {/* =====================================================
                BLUE HEADER
            ====================================================== */}

            <div
              className="
                relative
                h-[190px]
                overflow-hidden
                bg-[#084783]
              "
            >
              {/* MAIN DARK BACKGROUND */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#171717]
                  via-[#242424]
                  to-[#111111]
                "
              />

              {/* DECORATIVE TOP WAVE */}

              <svg
                className="
                  absolute
                  left-0
                  top-0
                  h-[75px]
                  w-full
                "
                viewBox="0 0 794 100"
                preserveAspectRatio="none"
              >
                <path
                  d="
                    M0 40
                    C120 0 210 40 320 25
                    C440 8 530 5 650 0
                    C710 -3 760 0 794 0
                    L794 20
                    C680 28 580 30 480 35
                    C350 42 240 75 120 65
                    C70 61 30 58 0 68
                    Z
                  "
                  fill="#0b5aa6"
                />

                <path
                  d="
                    M0 52
                    C130 10 220 55 340 35
                    C460 15 580 10 794 0
                    L794 10
                    C590 30 470 32 350 48
                    C220 66 130 25 0 72
                    Z
                  "
                  fill="#176bb7"
                />
              </svg>

              {/* BOTTOM CURVED WHITE SECTION */}

              <svg
                className="
                  absolute
                  bottom-[-1px]
                  left-0
                  h-[100px]
                  w-full
                "
                viewBox="0 0 794 120"
                preserveAspectRatio="none"
              >
                <path
                  d="
                    M0 120
                    C85 35 190 15 310 35
                    C430 55 535 55 650 38
                    C710 29 755 15 794 0
                    L794 120
                    Z
                  "
                  fill="white"
                />
              </svg>

              {/* HEADER CONTENT */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-start
                  justify-between
                  px-8
                  pt-12
                  sm:px-12
                "
              >
                {/* LOGO */}

                <div className="h-36 w-36">
                  <img
                    src="./White Logo.png"
                    alt="Prestigieux MediaTech logo"
                    className="cursor-pointer"
                  />
                </div>

                {/* INVOICE NUMBER */}

                <div
                  className="
                    pt-3
                    text-right
                    text-white
                  "
                >
                  <p
                    className="
                      text-sm
                      font-bold
                      sm:text-base
                    "
                  >
                    NO:{" "}
                    <span className="font-semibold">
                      {invoiceData.invoiceNumber}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <main
              className="
                px-7
                pb-12
                sm:px-12
              "
            >
              {/* =================================================
                  BILL TO / FROM
              ================================================== */}

              <section
                className="
                  grid
                  grid-cols-2
                  gap-6
                  sm:gap-12
                "
              >
                {/* ================= BILL TO ================= */}

                <div>
                  <h2
                    className="
                      lilita
                      text-lg
                      font-bold
                      text-gray-600
                    "
                  >
                    Bill To:
                  </h2>

                  <div
                    className="
                      mt-1
                      text-[12px]
                      leading-[1.6]
                      text-[#777]
                      sm:text-[14px]
                    "
                  >
                    <p className="font-medium arbutusp">
                      {invoiceData.CbusinessName ||
                        "-"}
                    </p>

                    <p>
                      {invoiceData.Cemail ||
                        "-"}
                    </p>

                    <p>
                      {invoiceData.Cphone ||
                        "-"}
                    </p>

                    <p>
                      {invoiceData.Caddress ||
                        "-"}
                    </p>
                  </div>
                </div>

                {/* ================= FROM ================= */}

                <div className="text-right">
                  <h2
                    className="
                      text-[16px]
                      lalita
                      font-bold
                      text-[#555]
                      sm:text-[18px]
                    "
                  >
                    From:
                  </h2>

                  <div
                    className="
                      mt-1
                      text-[11px]
                      leading-[1.6]
                      text-[#777]
                      sm:text-[13px]
                    "
                  >
                    <p
                      className="
                        font-semibold
                        text-[#555]
                        arbutus
                      "
                    >
                      {invoiceData.BbusinessName ||
                        "-"}
                    </p>

                    <p className="arbutusp">
                      {invoiceData.Baddress ||
                        "-"}
                    </p>

                    <p className="arbutusp">
                      {invoiceData.Bphone ||
                        "-"}
                    </p>

                    <p className="arbutusp">
                      {invoiceData.Bemail ||
                        "-"}
                    </p>
                  </div>
                </div>
              </section>

              {/* =================================================
                  DATE
              ================================================== */}

              <div className="mt-8 arbutus">
                <p
                  className="
                    text-[12px]
                    text-[#777]
                    sm:text-[14px]
                  "
                >
                  <span className="font-medium">
                    Date:
                  </span>{" "}
                  {formatDate(
                    invoiceData.date
                  )}
                </p>
              </div>

              {/* =====================================================
                  INVOICE TABLE
              ====================================================== */}

              <section className="mt-8">
                {/* TABLE */}

                <div
                  className="
                    overflow-hidden
                    rounded-sm
                    border
                    border-[#d7d7d7]
                  "
                >
                  {/* TABLE HEADER */}

                  <div
                    className="
                      grid
                      grid-cols-[1.6fr_.4fr_.7fr_.8fr]
                      bg-[#242424]
                      text-white
                    "
                  >
                    {/* Description */}

                    <div
                      className="
                        lalita
                        border-r
                        border-white/10
                        px-3
                        py-3
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        sm:text-[11px]
                      "
                    >
                      Description
                    </div>

                    {/* Qty */}

                    <div
                      className="
                        lalita
                        border-r
                        border-white/10
                        px-1
                        py-3
                        text-center
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        sm:text-[11px]
                      "
                    >
                      Qty
                    </div>

                    {/* Price */}

                    <div
                      className="
                        lalita
                        border-r
                        border-white/10
                        px-1
                        py-3
                        text-center
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        sm:text-[11px]
                      "
                    >
                      Price
                    </div>

                    {/* Total */}

                    <div
                      className="
                        lalita
                        bg-[#38BDF8]
                        px-1
                        py-3
                        text-center
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.1em]
                        text-[#111]
                        sm:text-[11px]
                      "
                    >
                      Total
                    </div>
                  </div>

                  {/* =================================================
                      TABLE ROWS
                  ================================================== */}

                  {invoiceItems.length > 0 ? (
                    invoiceItems.map(
                      (item, index) => {
                        const quantity =
                          Number(
                            item.quantity ||
                              1
                          );

                        const rate =
                          Number(
                            item.rate ||
                              0
                          );

                        const discount =
                          Number(
                            item.discount ||
                              0
                          );

                        const tax =
                          Number(
                            item.tax ||
                              0
                          );

                        const itemSubtotal =
                          quantity *
                          rate;

                        const discountAmount =
                          (itemSubtotal *
                            discount) /
                          100;

                        const taxableAmount =
                          itemSubtotal -
                          discountAmount;

                        const taxAmount =
                          (taxableAmount *
                            tax) /
                          100;

                        const itemTotal =
                          taxableAmount +
                          taxAmount;

                        return (
                          <div
                            key={
                              item.id ||
                              item._id ||
                              index
                            }
                            className="
                              arbutusp
                              group
                              grid
                              min-h-[52px]
                              grid-cols-[1.6fr_.4fr_.7fr_.8fr]
                              bg-white
                              transition-colors
                              hover:bg-[#f8fbfd]
                            "
                          >
                            {/* Description */}

                            <div
                              className="
                                flex
                                items-center
                                border-r
                                border-[#e2e2e2]
                                px-3
                                py-3
                                text-[10px]
                                font-medium
                                text-[#444]
                                sm:text-[12px]
                              "
                            >
                              <div>
                                <p className="arbutusp">
                                  {item.description ||
                                    "-"}
                                </p>

                                <span
                                  className="
                                    mt-1
                                    block
                                    text-[8px]
                                    font-normal
                                    text-[#999]
                                    sm:text-[9px]
                                  "
                                >
                                  Digital Marketing
                                  Services
                                </span>
                              </div>
                            </div>

                            {/* Quantity */}

                            <div
                              className="
                                flex
                                items-center
                                justify-center
                                border-r
                                border-[#e2e2e2]
                                text-[10px]
                                font-medium
                                text-[#555]
                                sm:text-[12px]
                                arbutusp
                              "
                            >
                              {quantity}
                            </div>

                            {/* Price */}

                            <div
                              className="
                                flex
                                items-center
                                justify-center
                                border-r
                                border-[#e2e2e2]
                                text-[10px]
                                font-medium
                                text-[#555]
                                sm:text-[12px]
                                arbutusp
                              "
                            >
                              ₹
                              {rate.toLocaleString(
                                "en-IN"
                              )}
                            </div>

                            {/* Total */}

                            <div
                              className="
                                flex
                                items-center
                                justify-center
                                bg-[#f0faff]
                                text-[10px]
                                font-bold
                                text-[#0879a8]
                                sm:text-[12px]
                                arbutusp
                              "
                            >
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div
                      className="
                        px-4
                        py-6
                        text-center
                        text-xs
                        text-gray-500
                      "
                    >
                      No invoice items
                    </div>
                  )}
                </div>

                {/* =================================================
                    SUB TOTAL
                ================================================== */}

                <div className="mt-3 flex justify-end">
                  <div
                    className="
                      flex
                      w-[230px]
                      items-center
                      justify-between
                      border
                      border-[#d7d7d7]
                      bg-[#fafafa]
                    "
                  >
                    <span
                      className="
                        border-r
                        border-[#d7d7d7]
                        px-5
                        py-2.5
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#777]
                        sm:text-[11px]
                      "
                    >
                      Sub Total
                    </span>

                    <span
                      className="
                        px-5
                        py-2.5
                        text-[12px]
                        font-bold
                        text-[#222]
                        sm:text-[13px]
                      "
                    >
                      ₹
                      {Number(
                        invoiceData.subtotal ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </section>

              {/* =====================================================
                  NOTES + SIGNATURE
              ====================================================== */}

              <section
                className="
                  mt-8
                  grid
                  grid-cols-2
                  items-end
                  gap-8
                "
              >
                {/* =================================================
                    NOTES
                ================================================== */}

                <div>
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <h3
                      className="
                        lilita
                        text-[12px]
                        font-bold
                        uppercase
                        tracking-[0.08em]
                        text-[#222]
                        sm:text-lg
                      "
                    >
                      Notes
                    </h3>

                    <div
                      className="
                        h-[1px]
                        flex-1
                        bg-[#d9d9d9]
                      "
                    />
                  </div>

                  <div className="space-y-[6px]">
                    {itemNotes.length > 0 ? (
                      itemNotes.map(
                        (note, index) => (
                          <div
                            key={`${index}-${note}`}
                            className="
                              flex
                              items-start
                              gap-2
                            "
                          >
                            {/* Bullet */}

                            <span
                              className="
                                mt-[5px]
                                h-[3px]
                                w-[3px]
                                shrink-0
                                rounded-full
                                bg-gray-900
                              "
                            />

                            {/* Note */}

                            <p
                              className="
                                arbutusp
                                text-[9px]
                                leading-[1.5]
                                text-[#666]
                                sm:text-[10px]
                              "
                            >
                              {note}
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <p
                        className="
                          arbutusp
                          text-[10px]
                          text-[#999]
                        "
                      >
                        No notes added.
                      </p>
                    )}
                  </div>
                </div>

                {/* =================================================
                    SIGNATURE
                ================================================== */}

                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-end
                    pb-1
                  "
                >
                  {/* Signature */}

                  <img
                    src={assets.signature}
                    alt="Authorized Signature"
                    className="
                      h-20
                      w-28
                      object-contain
                      sm:h-24
                      sm:w-32
                    "
                  />

                  {/* Signature Line */}

                  <div
                    className="
                      mt-1
                      w-32
                      border-t
                      border-[#444]
                      sm:w-36
                    "
                  />

                  {/* Label */}

                  <p
                    className="
                      arbutusp
                      mt-1
                      text-[9px]
                      font-medium
                      uppercase
                      tracking-[0.08em]
                      text-[#555]
                      sm:text-[10px]
                    "
                  >
                    Authorized Signature
                  </p>
                </div>
              </section>

              {/* =====================================================
                  THANK YOU
              ====================================================== */}

              <div className="mt-10 flex justify-end">
                <h2
                  className="
                    pr-5
                    text-[30px]
                    font-bold
                    text-[#0d2138]
                    sm:text-[38px]
                  "
                >
                  Thank You!
                </h2>
              </div>
            </main>

            {/* =====================================================
                BOTTOM BLUE ACCENT
            ====================================================== */}

            <div
              className="
                absolute
                bottom-0
                left-0
                h-[7px]
                w-full
                bg-[#084783]
              "
            />
          </div>
        </div>

        {/* =====================================================
            DOWNLOAD BUTTON
        ====================================================== */}

        <div
          className="
            invoice-print-button
            mx-auto
            mt-6
            flex
            max-w-[794px]
            justify-center
            print:hidden
          "
        >
          <button
            onClick={downloadInvoice}
            className="
              bg-[#084783]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#063b78]
            "
          >
            Download Invoice
          </button>


          <button
            onClick={handleSendWhatsApp}
            className="
              bg-[#084783]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#063b78]
            "
          >
            Whats App
          </button>
        </div>
      </div>
    </>
  );
};

export default InvoiceTemplate2;