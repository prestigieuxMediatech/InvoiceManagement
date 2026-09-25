import express from "express";
import { Login} from "../controller/userController.js";
import { allInvoices, createInvoice, deleteInvoice, invoices, sendInvoiceToWhatsapp, setInvoiceStatus, updateInvoice } from "../controller/InvoiceController.js";
import { AuthUser } from "../middleware/Auth.js";
import { addItem, deleteItem, getAllItem } from "../controller/ItemController.js";
import { upload } from "../middleware/multer.js";
import { createQoutation, deleteQoutationById, getQoutation, getQoutationByid, updateQoutationByid } from "../controller/QoutationController.js";
import { getWhatsAppQRController, getWhatsAppStatusController, logoutWhatsAppController, reconnectWhatsAppController } from "../controller/WhatsAppController.js";
import { getWhatsAppStatus } from "../config/whatsapp.js";

export const userRouter=express.Router()

// All Routes 
userRouter.post('/login', Login)


// --------------------------------- INVOICE ROUTER ----------------------
// ``````````````````````````````````````````````````````````````````
//create invoice 
userRouter.post('/createinvoice',AuthUser ,createInvoice)

//all invoice 
userRouter.get("/allinvoices",AuthUser,allInvoices)

// invoice
userRouter.get("/invoice",AuthUser, invoices)


 // update invoice 
userRouter.put('/updateinvoice/:id', AuthUser,updateInvoice)

//deleted invoice 
userRouter.delete('/deleteinvoice/:id',AuthUser,deleteInvoice)

// send invoice
userRouter.post("/sendinvoice",AuthUser,upload.single('pdf') ,sendInvoiceToWhatsapp)

// update status 
userRouter.post("/update-invoice-status",AuthUser,setInvoiceStatus)



// --------------------------------- ITEM ROUTER  ROUTER ----------------------
// ``````````````````````````````````````````````````````````````````
  // create item
userRouter.post("/createitem",AuthUser,addItem)
  //  get all item 
userRouter.get("/allitem",AuthUser, getAllItem )
  // delete item
userRouter.delete("/deleteitem/:id", AuthUser, deleteItem)

// --------------------------------- QOUTATION ROUTER  ----------------------
// ``````````````````````````````````````````````````````````````````
userRouter.post("/createqoutation", AuthUser, createQoutation)

//get All Qoutation
userRouter.get("/getqoutation", AuthUser, getQoutation)

// get Qoutation By Id
userRouter.get("/get-qoutation-by-id/:id", AuthUser, getQoutationByid)


// update  Qoutation 
userRouter.post("/update-qoutation-by-id/:id", AuthUser, updateQoutationByid)

//delete QOutation
userRouter.delete("/delete-qoutation/:id",AuthUser, deleteQoutationById)








// --------------------------------- QOUTATION ROUTER  ----------------------
// ``````````````````````````````````````````````````````````````````
// get qr code 
userRouter.get('/getqr',AuthUser,getWhatsAppQRController)

// logout WhatsApp
userRouter.get('/logout',AuthUser,logoutWhatsAppController)

// get whatsApp Status 
userRouter.get("/getstatus",AuthUser,getWhatsAppStatusController)

//  reconnect the whatsApp

userRouter.get("/reconnect", AuthUser,reconnectWhatsAppController)

