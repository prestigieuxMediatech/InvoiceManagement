
import { qoutationModel } from "../models/qoutation.js"

export const createQoutation= async(req,res)=>{
            try{
                const{formData}=req.body

                const qoutation=await qoutationModel.create(formData)
                console.log(qoutation)
                
                res.json({success:true ,data:qoutation})
            }
            catch(e){
            console.log(e.message)
            res.json({success:false, error:e.message})
            }
}


export const getQoutation=async(req, res)=>{
    try{
        const Qoutation=await qoutationModel.find({})

        res.json({success:true , Qoutation})
    }
    catch(e){
        res.json({success:false, error:e.message})
        console.log(e.message)
    }
}

export const getQoutationByid=async(req,res)=>{
    try{
        const{id}=req.params
        console.log(id)
        const Qoutation=await qoutationModel.findOne({_id:id})
        console.log(Qoutation)

        res.json({success:true, Qoutation})
    }
    catch(e){
        console.log(e.error)
        res.json({success:false,error:e.message })
    }
}

export const updateQoutationByid=async(req,res)=>{
    try{
        const{id}=req.params
        const{data}=req.body
         await qoutationModel.findOneAndUpdate(
            {_id:id},
            {$set:data}
         )
         res.json({success:true, data:"updated successfully"})
    }
    catch(e){
        console.log(e.message)
    }
}