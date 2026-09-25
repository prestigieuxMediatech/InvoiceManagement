
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import { Button } from "../components/ui/button";
import assets from "../assets/assets";

import { toast } from "react-toastify";

import { InvoiceContext } from "../Context/InvoiceContext";

import axios from "axios";

import { useLocation } from "react-router-dom";
import { sendInvoiceWhatsApp } from "../sendFunctions";
import InvoiceLoadingSkeleton from "./InvoiceLoadingSkeleton";

const InvoiceTemplate = () => {
  const { backendUrl, getCookie , wLoading, setWLoading} =
    useContext(InvoiceContext);

  const location = useLocation();

  /* =====================================================
      DUMMY INVOICE DATA
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

        notes: [
          "Website development service included.",
          "Client will provide required content.",
        ],

        subtotal: 4000,
        discountAmount: 0,
        taxAmount: 0,
        total: 4000,
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

  const [usingDummyData, setUsingDummyData] =
    useState(false);

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
          BACKEND DATA AVAILABLE
      ================================================= */

      if (response.data?.data) {
        setInvoiceData(
          response.data.data
        );

        setUsingDummyData(false);

        console.log(
          "Using backend invoice data"
        );
      } else {
        /* =================================================
            NO BACKEND DATA
        ================================================= */

        console.log(
          "No invoice data found. Using dummy data."
        );

        setInvoiceData(
          dummyInvoiceData
        );

        setUsingDummyData(true);
      }
    } catch (error) {
      console.error(
        "Invoice Error:",
        error
      );

      /* =================================================
          API FAILED
      ================================================= */

      setInvoiceData(
        dummyInvoiceData
      );

      setUsingDummyData(true);

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

      setUsingDummyData(true);
    }
  }, [location.state]);

  /* =====================================================
      INVOICE ITEMS
  ====================================================== */

  const items =
    invoiceData?.item || [];

  /* =====================================================
      ITEM NOTES

      Notes are stored inside each item:

      item: [
        {
          description: "...",
          notes: [
            "note 1",
            "note 2"
          ]
        }
      ]

      We collect notes from ALL invoice items.
  ====================================================== */

  const itemNotes =
    items.flatMap((item) => {
      if (!Array.isArray(item?.notes)) {
        return [];
      }

      return item.notes
        .map((note) => {
          /* ---------------------------------------------
              If note is a string
          --------------------------------------------- */

          if (
            typeof note === "string"
          ) {
            return note.trim();
          }

          /* ---------------------------------------------
              If note is an object

              Supports:

              {
                text: "some note"
              }
          --------------------------------------------- */

          if (
            typeof note === "object" &&
            note !== null
          ) {
            return (
              note.text?.trim() || ""
            );
          }

          return "";
        })
        .filter(Boolean);
    });

  /* =====================================================
      DEBUG ITEM NOTES

      Remove these logs later if you want.
  ====================================================== */

  console.log(
    "Invoice Items:",
    items
  );

  console.log(
    "Item Notes:",
    itemNotes
  );

  /* =====================================================
      RESPONSIVE SCALE
  ====================================================== */

  const [scale, setScale] =
    useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth =
        window.innerWidth;

      const availableWidth =
        screenWidth - 24;

      const newScale =
        Math.min(
          1,
          availableWidth / 794
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

        /* =================================================
            SAVE CURRENT TRANSFORM
        ================================================== */

        const originalTransform =
          invoice.style.transform;

        /* =================================================
            REMOVE RESPONSIVE SCALE
        ================================================== */

        invoice.style.transform =
          "none";

        /* =================================================
            WAIT FOR RENDER
        ================================================== */

        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              100
            )
        );

        /* =================================================
            CAPTURE INVOICE
        ================================================== */

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

              height: 1123,

              windowWidth: 794,

              windowHeight: 1123,
            }
          );

        /* =================================================
            RESTORE SCALE
        ================================================== */

        invoice.style.transform =
          originalTransform;

        /* =================================================
            CONVERT TO IMAGE
        ================================================== */

        const imgData =
          canvas.toDataURL(
            "image/jpeg",
            1.0
          );

        /* =================================================
            CREATE A4 PDF
        ================================================== */

        const pdf =
          new jsPDF({
            orientation:
              "portrait",

            unit: "mm",

            format: "a4",
          });

        /* =================================================
            ADD IMAGE TO A4
        ================================================== */

        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          210,
          297,
          undefined,
          "FAST"
        );

        /* =================================================
            DOWNLOAD
        ================================================== */

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


    // ADD THIS
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
      SAFE DATE FORMATTER
  ====================================================== */

  const formatDate = (
    date
  ) => {
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
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

 
  /* =====================================================
      RENDER
  ====================================================== */

  return (

wLoading ? ( <InvoiceLoadingSkeleton/>)

  :(  <div className="min-h-screen w-full overflow-x-hidden bg-gray-200 py-4 sm:py-10">

      {/* =====================================================
          DOWNLOAD BUTTON
      ====================================================== */}

      <div className="flex place-self-center">
        <Button
          onClick={
            downloadInvoice
          }
        >
          Download Button
        </Button>

         <Button
          onClick={
            handleSendWhatsApp
          }
        >
          send invoice Button
        </Button>
      </div>

      {/* =====================================================
          DEMO INDICATOR
      ====================================================== */}

      {usingDummyData && (
        <div className="mx-auto mt-3 w-fit rounded-lg bg-yellow-100 px-3 py-1 text-[10px] font-medium text-yellow-700">
          Demo Invoice Data
        </div>
      )}

      {/* =====================================================
          RESPONSIVE SCALE CONTAINER
      ====================================================== */}

      <div
        className="mx-auto pt-10"
        style={{
          width: `${794 * scale}px`,
          height: `${1123 * scale}px`,
        }}
      >
        {/* =====================================================
            ORIGINAL A4 INVOICE
        ====================================================== */}

        <div
          id="invoice"
          className="
            relative
            h-[1123px]
            w-[794px]
            origin-top-left
            overflow-hidden
            bg-white
            shadow-2xl
          "
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* =====================================================
              TOP HEADER
          ====================================================== */}

          <div className="relative w-full">

            <div className="flex flex-row items-center justify-between">

              <div className="w-[70%] overflow-hidden">

                <svg
                  viewBox="0 0 1000 70"
                  width="100%"
                  height="70"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 25 H1000 V48 H0 Z"
                    fill="#16A9E8"
                  />

                  <path
                    d="M0 5 H865 L870 25 H0 Z"
                    fill="#292929"
                  />

                  <path
                    d="M865 5 H820 L850 48 H895 Z"
                    fill="#292929"
                  />
                </svg>

              </div>

              <div className="mr-10 flex items-center gap-[12px]">

                <div className="h-36 w-36">

                  <img
                    src="./BlackLogo.png"
                    alt="logo image"
                    className="h-full w-full object-contain"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div className="z-10 mt-0 px-[80px]">

            {/* =====================================================
                ISSUED TO
            ====================================================== */}

            <div className="grid grid-cols-2">

              <div>

                <p className="text-[11px] font-bold tracking-[0.18em]">
                  ISSUED TO:
                </p>

                <p className="mt-2 text-[13px]">
                  {
                    invoiceData.CbusinessName
                  }
                </p>

                <p className="text-[13px]">
                  {
                    invoiceData.Cemail
                  }
                </p>

                <p className="text-[13px]">
                  {
                    invoiceData.Cphone
                  }
                </p>

                <p className="max-w-[250px] text-[11px] leading-4 text-gray-600">
                  {
                    invoiceData.Caddress
                  }
                </p>

              </div>

              {/* =====================================================
                  INVOICE INFORMATION
              ====================================================== */}

              <div className="text-right">

                <p className="text-[11px] font-bold tracking-[0.15em]">

                  INVOICE NO:

                  <span className="ml-4 font-normal tracking-normal">
                    {
                      invoiceData.invoiceNumber
                    }
                  </span>

                </p>

                <p className="mt-3 text-[11px] font-bold tracking-[0.15em]">

                  DATE:

                  <span className="ml-4 font-normal tracking-normal">
                    {formatDate(
                      invoiceData.date
                    )}
                  </span>

                </p>

                <p className="mt-3 text-[11px] font-bold tracking-[0.15em]">

                  DUE DATE:

                  <span className="ml-4 font-normal tracking-normal">
                    {formatDate(
                      invoiceData.dueDate
                    )}
                  </span>

                </p>

              </div>

            </div>

            {/* =====================================================
                PAY TO
            ====================================================== */}

            <div className="mt-[48px] grid grid-cols-2">

              <div>

                <p className="text-[11px] font-bold tracking-[0.18em]">
                  PAY TO:
                </p>

                <div className="mt-4 space-y-[4px] text-[11px]">

                  <p className="font-bold">
                    {
                      invoiceData.BbusinessName
                    }
                  </p>

                  <p>
                    Mobile No :{" "}
                    {
                      invoiceData.Bphone
                    }
                  </p>

                  <p>
                    Email ID :{" "}
                    {
                      invoiceData.Bemail
                    }
                  </p>

                </div>

              </div>

              {/* =====================================================
                  SELLER ADDRESS
              ====================================================== */}

              <div
                className="
                  self-end
                  pl-[45px]
                  text-[11px]
                  leading-5
                  text-[#52748C]
                "
              >

                <p>
                  {
                    invoiceData.Baddress
                  }
                </p>

              </div>

            </div>

            {/* =====================================================
                TABLE
            ====================================================== */}

            <div className="mt-[40px]">

              <div
                className="
                  grid
                  grid-cols-[3fr_1fr]
                  border-y
                  border-[#333]
                  px-4
                  py-[13px]
                "
              >

                <div className="text-[10px] font-bold tracking-[0.2em]">
                  DESCRIPTION
                </div>

                <div className="text-right text-[10px] font-bold tracking-[0.2em]">
                  AMOUNT
                </div>

              </div>

              {/* =====================================================
                  ITEMS
              ====================================================== */}

              {items.length >
              0 ? (
                items.map(
                  (
                    item,
                    index
                  ) => {

                    const itemSubtotal =
                      Number(
                        item.rate ||
                          0
                      ) *
                      Number(
                        item.quantity ||
                          1
                      );

                    const discount =
                      Number(
                        item.discount ||
                          0
                      );

                    const discountAmount =
                      (itemSubtotal *
                        discount) /
                      100;

                    const taxableAmount =
                      itemSubtotal -
                      discountAmount;

                    const tax =
                      Number(
                        item.tax ||
                          0
                      );

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
                          grid
                          grid-cols-[3fr_1fr]
                          px-4
                          py-[20px]
                          text-[13px]
                        "
                      >

                        <div>
                          {
                            item.description
                          }
                        </div>

                        <div className="text-right">

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
                <div className="px-4 py-5 text-[12px] text-gray-500">
                  No items added.
                </div>
              )}

              <div className="border-b border-[#333]" />

            </div>

            {/* =====================================================
                TOTAL
            ====================================================== */}

            <div className="mt-[25px] flex justify-end">

              <div className="w-[270px]">

                {/* SUBTOTAL */}

                <div className="flex justify-between py-[7px] text-[12px]">

                  <span>
                    SUBTOTAL
                  </span>

                  <span>
                    ₹
                    {Number(
                      invoiceData.subtotal ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* DISCOUNT */}

                {Number(
                  invoiceData.totalDiscount ||
                    0
                ) > 0 && (
                  <div className="flex justify-between py-[7px] text-[12px]">

                    <span>
                      DISCOUNT
                    </span>

                    <span>
                      - ₹
                      {Number(
                        invoiceData.totalDiscount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>
                )}

                {/* TAX */}

                <div className="flex justify-between py-[7px] text-[12px]">

                  <span>
                    TAX
                  </span>

                  <span>
                    ₹
                    {invoiceItemsTax(
                      invoiceData.item
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                {/* TOTAL */}

                <div
                  className="
                    mt-2
                    flex
                    justify-between
                    border-t
                    border-gray-300
                    pt-3
                    text-[15px]
                    font-bold
                  "
                >

                  <span>
                    TOTAL
                  </span>

                  <span>
                    ₹
                    {Number(
                      invoiceData.grandTotal ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* =====================================================
                IMPORTANT NOTES

                IMPORTANT:
                Notes come from item.notes

                Example backend:

                item: [
                  {
                    description: "...",
                    notes: [
                      "Note 1",
                      "Note 2"
                    ]
                  }
                ]
            ====================================================== */}

            <div className="mt-[42px]">

              <h3 className="text-[11px] font-bold tracking-[0.2em]">
                IMPORTANT NOTES :
              </h3>

              {itemNotes.length >
              0 ? (
                <ul
                  className="
                    mt-4
                    list-disc
                    space-y-[7px]
                    pl-4
                    text-[10px]
                    leading-4
                    text-gray-600
                  "
                >

                  {itemNotes.map(
                    (
                      note,
                      index
                    ) => (
                      <li
                        key={index}
                      >
                        {note}
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="mt-4 text-[10px] text-gray-500">
                  No additional notes.
                </p>
              )}

            </div>

          </div>

          {/* =====================================================
              THANK YOU
          ====================================================== */}

          <div
            className="
              absolute
              bottom-[72px]
              left-[80px]
              z-20
            "
          >

            <p className="text-[22px] leading-7">
              Thank you for your
            </p>

            <p className="text-[22px] leading-7">
              business!
            </p>

          </div>

          {/* =====================================================
              SIGNATURE
          ====================================================== */}

          <div
            className="
              absolute
              bottom-[68px]
              right-[105px]
              z-20
              text-center
            "
          >

            <div className="mb-2 text-[32px] italic">

              <img
                src={assets.signature}
                className="h-24 w-24"
                alt="signature"
              />

            </div>

            <div className="h-[1px] w-[140px] bg-black" />

            <p className="mt-2 text-[10px]">
              Authorized Signed
            </p>

          </div>

          {/* =====================================================
              BOTTOM SVG
          ====================================================== */}

          <div className="absolute bottom-0 right-0 w-[70%]">

            <svg
              viewBox="0 0 1000 70"
              width="100%"
              height="70"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >

              <g transform="translate(1000 0) scale(-1 1)">

                <path
                  d="M0 25 H1000 V48 H0 Z"
                  fill="#16A9E8"
                />

                <path
                  d="M0 5 H865 L870 25 H0 Z"
                  fill="#292929"
                />

                <path
                  d="M865 5 H820 L850 48 H895 Z"
                  fill="#292929"
                />

              </g>

            </svg>

          </div>

        </div>

      </div>

    </div>
  )
  );
};

/* =====================================================
    TAX CALCULATION

    itemSubtotal = rate × quantity

    discount is applied before tax

    tax = taxable amount × tax%
====================================================== */

const invoiceItemsTax = (
  items = []
) => {
  return items.reduce(
    (total, item) => {

      const itemSubtotal =
        Number(
          item?.rate || 0
        ) *
        Number(
          item?.quantity || 1
        );

      const discount =
        Number(
          item?.discount || 0
        );

      const discountAmount =
        (itemSubtotal *
          discount) /
        100;

      const taxableAmount =
        itemSubtotal -
        discountAmount;

      const tax =
        Number(
          item?.tax || 0
        );

      const taxAmount =
        (taxableAmount *
          tax) /
        100;

      return (
        total +
        taxAmount
      );
    },
    0
  );
};

export default InvoiceTemplate;
