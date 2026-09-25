import html2canvasPro from "html2canvas-pro";
import jsPDF from "jspdf";

export const sendInvoiceWhatsApp = async ({
  setWLoading,
  token,
  backendUrl,
  invoiceData,
  toast,
}) => {
  let invoice = null;
  let originalTransform = "";

  try {
    // =====================================================
    // START LOADING
    // =====================================================

    setWLoading(true);

    // =====================================================
    // GET INVOICE
    // =====================================================

    invoice = document.getElementById("invoice");

    if (!invoice) {
      throw new Error("Invoice element not found");
    }

    // =====================================================
    // SAVE CURRENT TRANSFORM
    // =====================================================

    originalTransform = invoice.style.transform;

    // =====================================================
    // REMOVE RESPONSIVE SCALE
    // =====================================================

    invoice.style.transform = "none";
    invoice.style.transformOrigin = "top left";

    // =====================================================
    // WAIT FOR RENDER
    // =====================================================

    await new Promise((resolve) =>
      setTimeout(resolve, 100)
    );

    // =====================================================
    // CAPTURE INVOICE
    // =====================================================

    const canvas = await html2canvasPro(invoice, {
      scale: 2,

      useCORS: true,

      allowTaint: false,

      backgroundColor: "#ffffff",

      logging: false,

      width: 794,

      height: 1123,

      windowWidth: 794,

      windowHeight: 1123,
    });

    // =====================================================
    // RESTORE ORIGINAL SCALE
    // =====================================================

    invoice.style.transform = originalTransform;

    // =====================================================
    // CONVERT TO IMAGE
    // =====================================================

    const imgData = canvas.toDataURL(
      "image/jpeg",
      1.0
    );

    // =====================================================
    // CREATE A4 PDF
    // =====================================================

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // =====================================================
    // ADD IMAGE TO A4
    // =====================================================

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

    // =====================================================
    // CREATE PDF BLOB
    // =====================================================

    const pdfBlob = pdf.output("blob");

    // =====================================================
    // CREATE FORM DATA
    // =====================================================

    const formData = new FormData();

    // =====================================================
    // WHATSAPP NUMBER
    // =====================================================
      console.log(invoiceData)
    formData.append(
      "phone",
      invoiceData?.Cphone || invoiceData.client.phone || ""
    );

    // =====================================================
    // PDF FILE
    // =====================================================

    formData.append(
      "pdf",
      pdfBlob,
      `${
        invoiceData?.invoiceNumber ||
        "Invoice"
      }.pdf`
    );

    // =====================================================
    // SEND TO BACKEND
    // =====================================================

    const response = await fetch(
      `${backendUrl}/sendinvoice`,
      {
        method: "POST",

        body: formData,

        headers: {
          token,
        },
      }
    );

    // =====================================================
    // BACKEND RESPONSE
    // =====================================================

    const data = await response.json();

    console.log(
      "WhatsApp response:",
      data
    );

    // =====================================================
    // SUCCESS
    // =====================================================

    if (data.success) {
      setWLoading(false);

      toast.success(
        "Invoice sent on WhatsApp ✅"
      );
    } else {
      setWLoading(false);

      toast.error(
        data.message ||
          "Failed to send invoice"
      );
    }
  } catch (error) {
    // =====================================================
    // RESTORE ORIGINAL SCALE
    // =====================================================

    if (invoice) {
      invoice.style.transform =
        originalTransform;
    }

    // =====================================================
    // STOP LOADING
    // =====================================================

    setWLoading(false);

    // =====================================================
    // ERROR
    // =====================================================

    console.error(
      "Failed to send invoice:",
      error
    );

    toast.error(
      "Failed to send invoice"
    );
  }
};


