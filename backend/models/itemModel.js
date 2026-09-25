import mongoose from "mongoose";

const itemSchema =mongoose.Schema({
     title:{
        type:String
     },
     price:{
        type:Number
     },
     notes:{
        type:[]
     },
     
})

export const itemModel=mongoose.model('item', itemSchema)