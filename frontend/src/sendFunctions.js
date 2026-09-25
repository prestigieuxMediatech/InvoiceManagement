import html2canvasPro from "html2canvas-pro";
import { jsPDF } from "jspdf";

export const sendInvoiceWhatsApp = async ({
  setWLoading,
  token,
  backendUrl,
  invoiceData,
  toast,
}) => {
  let invoiceClone = null;

  try {
    /* =====================================================
        START LOADING
    ====================================================== */

    setWLoading(true);

    /* =====================================================
        GET ORIGINAL INVOICE
    ====================================================== */

    const invoice =
      document.getElementById(
        "invoice"
      );

    if (!invoice) {
      throw new Error(
        "Invoice element not found"
      );
    }

    /* =====================================================
        CREATE CLONE

        IMPORTANT:
        We don't capture the original scaled invoice.
    ====================================================== */

    invoiceClone =
      invoice.cloneNode(true);

    /* =====================================================
        REMOVE RESPONSIVE TRANSFORM
    ====================================================== */

    invoiceClone.style.transform =
      "none";

    invoiceClone.style.transformOrigin =
      "top left";

    /* =====================================================
        FIX A4 SIZE
    ====================================================== */

    invoiceClone.style.width =
      "794px";

    invoiceClone.style.height =
      "1123px";

    /* =====================================================
        MOVE CLONE OUTSIDE VIEWPORT
    ====================================================== */

    invoiceClone.style.position =
      "absolute";

    invoiceClone.style.left =
      "-10000px";

    invoiceClone.style.top =
      "0";

    invoiceClone.style.margin =
      "0";

    invoiceClone.style.zIndex =
      "-9999";

    /* =====================================================
        ADD CLONE TO BODY
    ====================================================== */

    document.body.appendChild(
      invoiceClone
    );

    /* =====================================================
        WAIT FOR BROWSER RENDER
    ====================================================== */

    await new Promise(
      (resolve) => {
        requestAnimationFrame(
          () => {
            requestAnimationFrame(
              resolve
            );
          }
        );
      }
    );

    /* =====================================================
        WAIT FOR IMAGES
    ====================================================== */

    const images =
      Array.from(
        invoiceClone.querySelectorAll(
          "img"
        )
      );

    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise(
          (resolve) => {
            img.onload =
              resolve;

            img.onerror =
              resolve;
          }
        );
      })
    );

    /* =====================================================
        CAPTURE CLONE
    ====================================================== */

    const canvas =
      await html2canvasPro(
        invoiceClone,
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

          scrollX: 0,

          scrollY: 0,
        }
      );

    /* =====================================================
        REMOVE CLONE
    ====================================================== */

    if (
      invoiceClone &&
      document.body.contains(
        invoiceClone
      )
    ) {
      document.body.removeChild(
        invoiceClone
      );

      invoiceClone = null;
    }

    /* =====================================================
        CANVAS → IMAGE
    ====================================================== */

    const imgData =
      canvas.toDataURL(
        "image/jpeg",
        1.0
      );

    /* =====================================================
        CREATE A4 PDF
    ====================================================== */

    const pdf =
      new jsPDF({
        orientation:
          "portrait",

        unit: "mm",

        format: "a4",
      });

    /* =====================================================
        ADD IMAGE TO PDF
    ====================================================== */

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

    /* =====================================================
        CREATE PDF BLOB
    ====================================================== */

    const pdfBlob =
      pdf.output("blob");

    console.log(
      "PDF generated:",
      pdfBlob.size
    );

    /* =====================================================
        GET WHATSAPP NUMBER
    ====================================================== */

    const phone =
      invoiceData?.Cphone ||
      invoiceData?.client?.phone ||
      "";

    console.log(
      "WhatsApp Phone:",
      phone
    );

    if (!phone) {
      throw new Error(
        "Customer WhatsApp number is missing"
      );
    }

    /* =====================================================
        CREATE FORM DATA
    ====================================================== */

    const formData =
      new FormData();

    /* =====================================================
        PHONE
    ====================================================== */

    formData.append(
      "phone",
      phone
    );

    /* =====================================================
        PDF

        IMPORTANT:
        Backend must use upload.single("pdf")
    ====================================================== */

    formData.append(
      "pdf",
      pdfBlob,
      `${
        invoiceData?.invoiceNumber ||
        "Invoice"
      }.pdf`
    );

    /* =====================================================
        DEBUG FORM DATA
    ====================================================== */

    console.log(
      "Sending invoice to:",
      `${backendUrl}/sendinvoice`
    );

    /* =====================================================
        SEND TO BACKEND
    ====================================================== */

    const response =
      await fetch(
        `${backendUrl}/sendinvoice`,
        {
          method: "POST",

          body: formData,

          headers: {
            token,
          },
        }
      );

    /* =====================================================
        RESPONSE
    ====================================================== */

    const data =
      await response.json();

    console.log(
      "WhatsApp response:",
      data
    );

    /* =====================================================
        CHECK RESPONSE
    ====================================================== */

    if (
      !response.ok ||
      !data.success
    ) {
      throw new Error(
        data.message ||
          "Failed to send invoice"
      );
    }

    /* =====================================================
        SUCCESS
    ====================================================== */

    toast.success(
      "Invoice sent on WhatsApp ✅"
    );

  } catch (error) {

    /* =====================================================
        REMOVE CLONE IF ERROR
    ====================================================== */

    if (
      invoiceClone &&
      document.body.contains(
        invoiceClone
      )
    ) {
      document.body.removeChild(
        invoiceClone
      );
    }

    /* =====================================================
        LOG ERROR
    ====================================================== */

    console.error(
      "Failed to send invoice:",
      error
    );

    /* =====================================================
        SHOW ERROR
    ====================================================== */

    toast.error(
      error.message ||
        "Failed to send invoice"
    );

  } finally {

    /* =====================================================
        STOP LOADING
    ====================================================== */

    setWLoading(false);
  }
};