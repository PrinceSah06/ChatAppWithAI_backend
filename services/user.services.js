import User from "../models/user.models.js";


export const createUser=async ({email,password})=>{
    if (!email && !password) {
        throw new Error ('Email and Password  are required')
    }

    const hashedPassword = await User.hashPassword(password);

    const user  = await User.create({email,password:hashedPassword})
       await user.save()
       return user
}

export const getAllUser  = async ({userId})=>{
    console.log('inside get-all-user ')
    const users = await User.find({_id:{$ne : userId}})


    
 return users
}