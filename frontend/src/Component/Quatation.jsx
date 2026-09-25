import React, { useContext, useEffect, useState } from "react";
import {
  Download,
  Mail,
  Phone,
  Globe2,
  ArrowUpRight,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { InvoiceContext } from "../Context/InvoiceContext";
import { sendInvoiceWhatsApp } from "../sendFunctions";

const Quatation = () => {
  const [scale, setScale] = useState(1);
  const [quotation, setQuotation] = useState(null);
  const [services, setServices] = useState([]);
  const[loading,setLoading]=useState(false)
  const { backendUrl, getCookie, setWLoading } = useContext(InvoiceContext);
  const location = useLocation();

  const PAGE_WIDTH = 794;
  const PAGE_HEIGHT = 1123;

  /* =========================================================
     GET QUOTATION
  ========================================================== */

  const getQoutation = async () => {
    try {
      const token = getCookie("token");

      const response = await axios.get(
        `${backendUrl}/get-qoutation-by-id/${location.state}`,
        {
          headers: {
            token,
          },
        }
      );

      console.log("QUOTATION RESPONSE:", response.data);

      const data = response.data.Qoutation;

      setQuotation(data);
      setServices(Array.isArray(data?.services) ? data.services : []);
    } catch (error) {
      console.error("Get quotation error:", error);
      toast.error("Failed to load quotation.");
    }
  };

  useEffect(() => {
    if (location.state) {
      getQoutation();
    }
  }, [location.state]);

  /* =========================================================
     TOTAL
  ========================================================== */

  const total = services.reduce(
    (sum, service) => sum + Number(service?.price || 0),
    0
  );

  /* =========================================================
     RESPONSIVE SCALE
  ========================================================== */

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 400) {
        setScale((screenWidth - 16) / PAGE_WIDTH);
      } else if (screenWidth <= 640) {
        setScale((screenWidth - 20) / PAGE_WIDTH);
      } else if (screenWidth <= 900) {
        setScale((screenWidth - 40) / PAGE_WIDTH);
      } else if (screenWidth <= 1100) {
        setScale(0.82);
      } else {
        setScale(1);
      }
    };

    updateScale();

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  /* =========================================================
     PRICE FORMAT
  ========================================================== */

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  /* =========================================================
     DATE FORMAT
  ========================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /* =========================================================
     DOWNLOAD PDF
  ========================================================== */

  const downloadInvoice = async () => {
    const quotationElement = document.getElementById("quotation");

    if (!quotationElement) {
      toast.error("Quotation not found.");
      return;
    }

    try {
      const previousTransform = quotationElement.style.transform;
      const previousWidth = quotationElement.style.width;

      // Remove responsive scaling
      quotationElement.style.transform = "none";
      quotationElement.style.width = `${PAGE_WIDTH}px`;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const rect = quotationElement.getBoundingClientRect();

      const canvas = await html2canvas(quotationElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,

        width: rect.width,
        height: rect.height,

        windowWidth: rect.width,
        windowHeight: rect.height,

        scrollX: 0,
        scrollY: 0,
      });

      // Restore screen styles
      quotationElement.style.transform = previousTransform;
      quotationElement.style.width = previousWidth;

      const image = canvas.toDataURL("image/jpeg", 0.98);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const ratio = canvas.height / canvas.width;

      let imageWidth = pageWidth;
      let imageHeight = imageWidth * ratio;

      if (imageHeight > pageHeight) {
        const pdfScale = pageHeight / imageHeight;

        imageWidth *= pdfScale;
        imageHeight *= pdfScale;
      }

      const left = (pageWidth - imageWidth) / 2;
      const top = (pageHeight - imageHeight) / 2;

      pdf.addImage(
        image,
        "JPEG",
        left,
        top,
        imageWidth,
        imageHeight,
        undefined,
        "FAST"
      );

      const fileName = quotation?.quotationNumber
        ? `${quotation.quotationNumber}.pdf`
        : "Quotation.pdf";

      pdf.save(fileName);

      toast.success("Quotation downloaded successfully.");
    } catch (error) {
      console.error("Quotation download error:", error);

      toast.error("Failed to create quotation.");
    }
  };



      // ADD THIS
  const handleSendWhatsApp = () => {
    const token=getCookie('token')
    
    sendInvoiceWhatsApp({
       setWLoading,
      token,
      backendUrl,
      invoiceData:quotation,
      toast,
    });
  };

  /* =========================================================
     LOADING
  ========================================================== */

  if (!quotation) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#e8e8e5]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />

          <p className="text-sm font-medium text-gray-700">
            Loading quotation...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#e8e8e5]
        px-2
        py-10
        sm:px-4
        md:px-8
      "
    >
      {/* =========================================================
          DOWNLOAD BUTTON
      ========================================================== */}

      <button
        onClick={downloadInvoice}
        className="
          fixed
          right-3
          top-3
          z-50
          flex
          items-center
          gap-2
          bg-black
          px-4
          py-3
          text-[11px]
          font-medium
          uppercase
          tracking-[1px]
          text-white
          shadow-xl
          transition
          hover:bg-[#222]
          sm:right-5
          sm:top-5
          sm:px-5
        "
      >
        <Download size={15} />

        <span>Download</span>
      </button>

      {/* =========================================================
          SEND ON WHATS APP BUTTON
      ========================================================== */}

      <button
        onClick={handleSendWhatsApp}
        className="
          fixed
          right-3
          top-6
          z-50
          flex
          items-center
          gap-2
          bg-green-400
          px-4
          py-3
          text-[11px]
          font-medium
          uppercase
          tracking-[1px]
          text-white
          shadow-xl
          transition
          hover:bg-[#222]
          sm:right-5
          sm:top-26
          sm:px-5
        "
      >
        <Download size={15} />

        <span>Send WhatsApp</span>
      </button>

      {/* =========================================================
          RESPONSIVE A4 WRAPPER
      ========================================================== */}

      <div
        className="mx-auto"
        style={{
          width: `${PAGE_WIDTH * scale}px`,
          height: `${PAGE_HEIGHT * scale}px`,
        }}
      >
        {/* =======================================================
            SCALE CONTAINER
        ======================================================== */}

        <div
          style={{
            width: `${PAGE_WIDTH}px`,
            height: `${PAGE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* =====================================================
              A4 QUOTATION
          ====================================================== */}

          <div
            id="invoice"
            className="
              relative
              h-[1123px]
              w-[794px]
              overflow-hidden
              bg-white
              font-sans
              text-black
            "
          >
            {/* =================================================
                LEFT SIDEBAR
            ================================================== */}

            <aside
              className="
                absolute
                bottom-0
                left-0
                top-0
                w-[180px]
                bg-[#111111]
              "
            >
              {/* LOGO */}

              <div
                className="
                  absolute
                  left-1/2
                  top-[24px]
                  z-20
                  flex
                  -translate-x-1/2
                  items-center
                  justify-center
                "
                style={{
                  width: "170px",
                  height: "170px",
                }}
              >
                <img
                  src="White Logo.png"
                  alt="Prestigieux"
                  className="
                    block
                    h-full
                    w-full
                    object-contain
                  "
                />
              </div>

              {/* TOP DIVIDER */}

              <div
                className="
                  absolute
                  left-1/2
                  top-[218px]
                  h-[1px]
                  w-[52px]
                  -translate-x-1/2
                  bg-white
                  opacity-50
                "
              />

              {/* VERTICAL BRAND */}

              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  z-10
                  -translate-x-1/2
                  -translate-y-1/2
                  rotate-[-90deg]
                  whitespace-nowrap
                "
              >
                <span
                  className="
                    text-[25px]
                    font-extrabold
                    uppercase
                    tracking-[5px]
                    text-white
                  "
                >
                  PRESTIGIEUX CREATIVE SOLUTIONS
                </span>
              </div>

              {/* BOTTOM DIVIDER */}

              <div
                className="
                  absolute
                  bottom-[45px]
                  left-1/2
                  h-[1px]
                  w-[52px]
                  -translate-x-1/2
                  bg-white
                  opacity-50
                "
              />
            </aside>

            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <main
              className="
                ml-[180px]
                box-border
                w-[614px]
                px-[32px]
                py-[38px]
              "
            >
              {/* =================================================
                  HEADER
              ================================================== */}

              <header>
                <div className="flex items-start justify-between">
                  {/* LEFT HEADER */}

                  <div>
                    <p
                      className="
                        text-[12px]
                        font-medium
                        uppercase
                        tracking-[3px]
                        text-[#777]
                      "
                    >
                      Prestigieux
                    </p>

                    <h1
                      className="
                        mt-3
                        text-[52px]
                        font-black
                        uppercase
                        leading-[0.88]
                        tracking-[-3px]
                      "
                    >
                      Quotation
                    </h1>

                    <div className="mt-4 h-[3px] w-[50px] bg-black" />
                  </div>

                  {/* RIGHT HEADER */}

                  <div className="pt-2 text-right">
                    <p
                      className="
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[2px]
                        text-[#999]
                      "
                    >
                      Quote Number
                    </p>

                    <p className="mt-1 text-[12px] font-bold">
                      {quotation.quotationNumber || "-"}
                    </p>

                    <p
                      className="
                        mt-5
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[2px]
                        text-[#999]
                      "
                    >
                      Issue Date
                    </p>

                    <p className="mt-1 text-[12px] font-bold">
                      {formatDate(quotation.date)}
                    </p>

                    {quotation.validUntil && (
                      <>
                        <p
                          className="
                            mt-5
                            text-[9px]
                            font-medium
                            uppercase
                            tracking-[2px]
                            text-[#999]
                          "
                        >
                          Valid Until
                        </p>

                        <p className="mt-1 text-[12px] font-bold">
                          {formatDate(quotation.validUntil)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </header>

              {/* =================================================
                  CLIENT
              ================================================== */}

              <section className="mt-[38px]">
                <div className="flex items-start justify-between">
                  {/* CLIENT */}

                  <div className="min-w-0 max-w-[310px]">
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-[#999]
                      "
                    >
                      Prepared For
                    </p>

                    <h2
                      className="
                        mt-2
                        text-[24px]
                        font-bold
                        tracking-[-0.5px]
                      "
                    >
                      {quotation.client?.name || "-"}
                    </h2>

                    <p className="mt-1 text-[10px] leading-4 text-[#666]">
                      {quotation.client?.address || "-"}
                    </p>

                    {quotation.client?.email && (
                      <p className="mt-1 text-[9px] text-[#777]">
                        {quotation.client.email}
                      </p>
                    )}

                    {quotation.client?.phone && (
                      <p className="mt-1 text-[9px] text-[#777]">
                        {quotation.client.phone}
                      </p>
                    )}
                  </div>

                  {/* PROJECT */}

                  <div className="w-[205px]">
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-[#999]
                      "
                    >
                      Project
                    </p>

                    <p className="mt-2 text-[12px] font-semibold leading-4">
                      {quotation.project?.name || "-"}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-[#777]">
                      {quotation.project?.description || "-"}
                    </p>

                    {quotation.billing && (
                      <p className="mt-2 text-[9px] font-semibold uppercase tracking-[1px] text-[#777]">
                        Billing: {quotation.billing}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 border-t border-black" />
              </section>

              {/* =================================================
                  INTRODUCTION
              ================================================== */}

              <section
                className="
                  mt-6
                  grid
                  grid-cols-[115px_1fr]
                  gap-5
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#2563eb]
                    "
                  >
                    Introduction
                  </p>
                </div>

                <p
                  className="
                    max-w-[420px]
                    text-[10px]
                    leading-[1.5]
                    text-[#555]
                  "
                >
                  We are pleased to present the following quotation for digital
                  services. The scope below has been structured to provide
                  consistent creative, marketing and technical support for your
                  business.
                </p>
              </section>

              {/* =================================================
                  SERVICES
              ================================================== */}

              <section className="mt-7">
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    border-b-2
                    border-black
                    pb-3
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[2px]
                        text-[#2563eb]
                      "
                    >
                      Services
                    </p>

                    <h2 className="mt-1 text-[21px] font-bold">
                      Scope of Work
                    </h2>
                  </div>

                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[1.5px]
                      text-[#999]
                    "
                  >
                    {quotation.billing || "Monthly"}
                  </p>
                </div>

                {/* SERVICE LIST */}

                <div>
                  {services.length > 0 ? (
                    services.map((service, index) => (
                      <div
                        key={`${service.no || index}-${service.title || index}`}
                        className="
                          grid
                          grid-cols-[32px_minmax(0,1fr)_100px]
                          gap-3
                          border-b
                          border-[#d8d8d8]
                          py-3
                        "
                      >
                        {/* NUMBER */}

                        <div>
                          <p
                            className="
                              text-[15px]
                              font-bold
                              text-[#2563eb]
                            "
                          >
                            {service.no || String(index + 1).padStart(2, "0")}
                          </p>
                        </div>

                        {/* SERVICE DETAILS */}

                        <div className="min-w-0">
                          <h3
                            className="
                              text-[16px]
                              font-bold
                              leading-5
                            "
                          >
                            {service.title || "-"}
                          </h3>

                          <div
                            className="
                              mt-2
                              grid
                              grid-cols-2
                              gap-x-4
                              gap-y-[2px]
                            "
                          >
                            {Array.isArray(service.deliverables) &&
                            service.deliverables.length > 0 ? (
                              service.deliverables.map((item, itemIndex) => (
                                <div
                                  key={`${item}-${itemIndex}`}
                                  className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-2
                                  "
                                >
                                  <span
                                    className="
                                      mt-[6px]
                                      h-[3px]
                                      w-[3px]
                                      shrink-0
                                      bg-black
                                    "
                                  />

                                  <span
                                    className="
                                      text-[10px]
                                      leading-[1.35]
                                      text-[#444]
                                    "
                                  >
                                    {item}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[10px] text-[#777]">
                                No deliverables specified.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* PRICE */}

                        <div
                          className="
                            border-l
                            border-[#d8d8d8]
                            pl-3
                          "
                        >
                          <p
                            className="
                              text-[8px]
                              uppercase
                              tracking-[1px]
                              text-[#999]
                            "
                          >
                            Investment
                          </p>

                          <p className="mt-2 text-[16px] font-bold">
                            ₹{formatPrice(service.price)}
                          </p>

                          <p className="mt-0.5 text-[9px] text-[#888]">
                            / {String(quotation.billing || "month").toLowerCase()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[10px] text-[#777]">
                      No services found.
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  TOTAL
              ================================================== */}

              <section className="mt-4 flex justify-end">
                <div className="w-[300px]">
                  <div
                    className="
                      flex
                      justify-between
                      border-b
                      border-[#ddd]
                      py-2
                    "
                  >
                    <span className="text-[10px] text-[#777]">
                      Service Total
                    </span>

                    <span className="text-[10px] font-semibold">
                      ₹
                      {formatPrice(
                        quotation.total !== undefined
                          ? quotation.total
                          : total
                      )}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-end
                      justify-between
                      border-b-2
                      border-black
                      py-3
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[1.5px]
                        "
                      >
                        Total Investment
                      </p>

                      <p className="mt-1 text-[9px] text-[#888]">
                        {quotation.billing || "Monthly"} billing
                      </p>
                    </div>

                    <p
                      className="
                        text-[26px]
                        font-black
                        tracking-[-1px]
                      "
                    >
                      ₹
                      {formatPrice(
                        quotation.total !== undefined
                          ? quotation.total
                          : total
                      )}
                    </p>
                  </div>
                </div>
              </section>

              {/* =================================================
                  TERMS
              ================================================== */}

              <section
                className="
                  mt-5
                  grid
                  grid-cols-[115px_1fr]
                  gap-5
                  border-t
                  border-black
                  pt-3
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[2px]
                      text-[#2563eb]
                    "
                  >
                    Terms
                  </p>

                  <p className="mt-1 text-[10px] font-bold">
                    Important Notes
                  </p>
                </div>

                <div className="space-y-1">
                  {Array.isArray(quotation.terms) &&
                  quotation.terms.length > 0 ? (
                    quotation.terms.map((term, index) => (
                      <p
                        key={`${term}-${index}`}
                        className="
                          text-[10px]
                          leading-[1.35]
                          text-[#666]
                        "
                      >
                        <span className="font-bold text-black">
                          {String(index + 1).padStart(2, "0")}.
                        </span>{" "}
                        {term}
                      </p>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#777]">
                      No terms specified.
                    </p>
                  )}
                </div>
              </section>

              {/* =================================================
                  SIGNATURE
              ================================================== */}

              <section
                className="
                  mt-5
                  flex
                  items-end
                  justify-between
                "
              >
                <div>
                  <p className="text-[10px] text-[#777]">
                    Thank you for considering our services.
                  </p>

                  <p className="mt-1 text-[10px] text-[#777]">
                    We look forward to working with you.
                  </p>
                </div>

                <div className="w-[145px] text-center">
                  <div
                    className="
                      flex
                      h-[30px]
                      items-end
                      justify-center
                    "
                  >
                    <span className="font-serif text-[18px] italic">
                      Prestigieux
                    </span>
                  </div>

                  <div className="border-t border-black" />

                  <p
                    className="
                      mt-1
                      text-[7px]
                      font-bold
                      uppercase
                      tracking-[1.3px]
                      text-[#777]
                    "
                  >
                    Authorized Signature
                  </p>
                </div>
              </section>

              {/* =================================================
                  FOOTER
              ================================================== */}

              <footer
                className="
                  mt-5
                  border-t
                  border-[#d8d8d8]
                  pt-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  {/* CONTACT DETAILS */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    {/* EMAIL */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Mail
                        size={10}
                        className="text-[#555]"
                      />

                      <span className="text-[9px] text-[#666]">
                        {quotation.business?.email || "-"}
                      </span>
                    </div>

                    {/* WEBSITE */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Globe2
                        size={10}
                        className="text-[#555]"
                      />

                      <span className="text-[9px] text-[#666]">
                        www.prestigieux.com
                      </span>
                    </div>

                    {/* PHONE */}

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Phone
                        size={10}
                        className="text-[#555]"
                      />

                      <span className="text-[9px] text-[#666]">
                        {quotation.business?.phone || "-"}
                      </span>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={13}
                    className="text-[#2563eb]"
                  />
                </div>
              </footer>
            </main>

            {/* =================================================
                BOTTOM BORDER
            ================================================== */}

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                h-[4px]
                bg-black
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quatation;