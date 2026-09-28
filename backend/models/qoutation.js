import mongoose from "mongoose";

const qoutationSchema=mongoose.Schema({
    
quotationNumber:{
    type:String
},
date:{
    type:String
},
billing:{
    type:String
},

business:{
type:{}
},

client:{
type:{}
},


// project:{
//     type:{}
// },


services:{
    type:[]
},


terms:{
    type:[]
},


total:{
    type:Number
},


})

export const qoutationModel=mongoose.model("qoutation", qoutationSchema)