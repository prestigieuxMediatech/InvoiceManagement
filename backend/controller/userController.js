import jwt from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'

//token function 
const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRATE)
}


export const Login=async(req,res)=>{
    try{
       const {userName,password}=req.body
       console.log(password)
        const user=await userModel.findOne({userName})
        if(!user)return res.json({success:false,error:'user not found'})

        else{
           
            if(password === user.password){
                const token=createToken(user._id)
                console.log(token)
               return res.json({success:true,token})
            }
            else{
                res.json({success:false,error:'wrong password'})
            }
        }

        

    }
    catch(e){
        return res.json({success:true, error:e.message})
    }
} 


