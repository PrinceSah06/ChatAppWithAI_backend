import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { configDotenv } from "dotenv";
configDotenv('env')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:false,
        trim:true,
        lowercase:true,
        minLength:[6,'Email shouled be more then 6 characters long'],
        maxLength:[50,'Email shouled be less then 50 characters ']
    },
        password:{
        type:String,
        required:true,
        select:false,
        trim:true,
        
       
    }
})

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10)
    
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

userSchema.methods.generateJWT  = async function () {
    return jwt.sign({email:this.email}
        ,process.env.JWT_SECRET,
        {expiresIn :'24h'})
    
}

const User = mongoose.model('user',userSchema)

export default User