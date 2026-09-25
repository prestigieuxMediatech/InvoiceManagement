import { itemModel } from "../models/itemModel.js"

export const  addItem=async(req,res)=>{
    try{
    const {title ,price,notes}=req.body

    const newItem=await itemModel.create({title,price,notes})

    res.json({success:true,newItem})
    }
    catch(e){
        console.log(e.message)
        res.json({success:false, error:e.message})
    }
}


export const getAllItem=async(req,res)=>{
        try{
            const allitem=await itemModel.find().sort({_id:-1})
            res.json({success:true, allitem})
        }
        catch(e){
            console.log(e.message)
            res.json({success:false, error:e.message})
        }
}

//delete items

export const deleteItem= async(req,res)=>{
    try{
        const id=req.params.id

        const response= await itemModel.findOneAndDelete({_id:id})
        res.json({success:true, data:"items deleted successfully "})
        
    }
    catch(e){
        console.log(e.message)
        res.json({success:false, error:e.message})
    }
}