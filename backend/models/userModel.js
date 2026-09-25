import mongoose from "mongoose";


const userSchema=mongoose.Schema({
    name:{type:String,},
    userName:{type:String},
    password:{type:String}
})

const userModel=mongoose.model('user',userSchema);
export default userModel;