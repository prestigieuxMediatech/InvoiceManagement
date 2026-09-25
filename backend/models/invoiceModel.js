import mongoose from "mongoose";

const InvoiceSchema=mongoose.Schema({
    invoiceNumber:{
        type:String
    },
    date:{
        type:String
    },
    status:{
        type:String,
        default:"unpaid"
    },
    dueDate:{
        type:String
    },

    BbusinessName:{
        type:String
    },

    Bemail:{
        type:String
    },

    Bphone:{
        type:String
    },
    Baddress:{
        type:String
    },


      CbusinessName:{
        type:String
    },

    Cemail:{
        type:String
    },

    Cphone:{
        type:String
    },
    Caddress:{
        type:String
    },

    item:{
    type:[]
    },

    additionalInfo:{
        type:[]
    },

    subtotal:{
        type:Number
    },

    totalDiscount:{
        type:Number
    },

    totalTax:{
        type:Number
    },

    grandTotal:{
        type:Number
    },

    template:{
        type:String
    }
})

const InvoiceModel=mongoose.model("invoice",InvoiceSchema)

export default InvoiceModel;