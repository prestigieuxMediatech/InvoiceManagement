import InvoiceModel from "../models/invoiceModel.js"
import fs from "fs/promises";

import {
    getWhatsApp,
    isWhatsAppReady,
    whatsapp,
} from "../config/whatsapp.js";



export const createInvoice=async(req,res)=>{
    try{
const{invoiceNumber,
    date,
    dueDate,

    BbusinessName,

    Bemail,

    Bphone,
    Baddress,


      CbusinessName,
    Cemail,

    Cphone,
    Caddress,
    item,
    additionalInfo,
    subtotal,
    grandTotal,
template}=req.body


const newInvoice =await InvoiceModel.create({
    invoiceNumber,
    date,
    dueDate,

    BbusinessName,

    Bemail,

    Bphone,
    Baddress,


      CbusinessName,
    Cemail,

    Cphone,
    Caddress,
    item,
    additionalInfo,
    subtotal,
    grandTotal,
template
})



res.json({success:true, data:newInvoice  
})

    }
    catch(e){
        console.log(e.message)
        res.json({success:true, error:e.message})
    }
}

//get  all invoices 
export const allInvoices=async(req,res)=>{
    try{
        const allInvoices=await InvoiceModel.find()
        
        res.json({success:true, data:allInvoices})
    }
    catch(e){
        res.json({success:false, error:e.message})
        console.log(e.message)
    }
}


//get a single invoices
export const  invoices=async(req,res)=>{
    try{
        const id=req.query.id
        const invoice=await InvoiceModel.findOne({_id:id})
       
        res.json({success:true, data:invoice})
    }
    catch(e){
        console.log(e.message)
        res.json({success:true, error:e.message})
    }
}


// update invoice 
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      invoiceNumber,
      date,
      dueDate,
      CbusinessName,
      Cemail,
      Cphone,
      Caddress,
    } = req.body;

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      {
        invoiceNumber,
        date,
        dueDate,
        CbusinessName,
        Cemail,
        Cphone,
        Caddress,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (e) {
    console.error("Update Invoice Error:", e.message);

    return res.status(500).json({
      success: false,
    
      error: e.message,
    });
  }
};

// delete invoice 
export const deleteInvoice= async(req,res)=>{
  try{
    const {id}=req.params

    await InvoiceModel.findOneAndDelete({_id:id})
     res.json({success:true, data:" invoice deleted successfully "})
  }
  catch(e){
    console.log( e.message)
  }
}



export const sendInvoiceToWhatsapp = async (req, res) => {
    try {
        const { phone } = req.body;

        const pdf1 = req.file
    
        console.log(pdf1)
       
        // Check WhatsApp connection
        if (!isWhatsAppReady()) {
            return res.status(400).json({
                success: false,
                message: "WhatsApp is not connected.",
            });
        }

        // Get Baileys socket
        const whatsapp = getWhatsApp();

        if (!whatsapp) {
            return res.status(400).json({
                success: false,
                message: "WhatsApp socket not available.",
            });
        }

        // Validate phone
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required.",
            });
        }

        
        // Create WhatsApp JID
        const jid = `91${phone}@s.whatsapp.net`;

        console.log("📱 Recipient:", jid);

        // Read first PDF
        const pdfBuffer1 = await fs.readFile(pdf1.path);

        console.log("📄 PDF 1:", pdf1.originalname);
        console.log("📦 PDF 1 size:", pdfBuffer1.length);

        // Send first PDF
        const result1 = await whatsapp.sendMessage(
            jid,
            {
                document: pdfBuffer1,
                mimetype: "application/pdf",
                fileName: pdf1.originalname,
                caption: `📄 Invoice ${pdf1.originalname}`,
            }
        );

        console.log("✅ PDF 1 sent");
        console.log("Message ID 1:", result1?.key?.id);

        // Read second PDF
     
      ;

        return res.status(200).json({
            success: true,
            message: "Both PDF files sent successfully.",
            messages: [
                {
                    fileName: pdf1.originalname,
                    messageId: result1?.key?.id,
                },
              
            ],
        });

    } catch (error) {
        console.error("❌ WhatsApp error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send WhatsApp PDFs.",
            error: error.message,
        });
    }
};
