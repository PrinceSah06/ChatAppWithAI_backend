import User from "../models/user.models.js";

import {createUser, getAllUser} from '../services/user.services.js'
import { validationResult } from "express-validator";
import readisClient from "../services/radis.servies.js";
export const createUserControler  = async(req,res)=>{
  console.log('inside register/login  controler')
    const errors = validationResult(req)


    if(!errors.isEmpty()){
        return res.status(400).json({error :errors.array()})
    }

    try {


         let user
  try {
             user  = await createUser(req.body);

  } catch (userError) {
    return res.status(500).json({ error: 'Failed to generate user' });
  }
 let token;
  try {
    
    token =  await user.generateJWT();
  } catch (jwtError) {
    return res.status(500).json({ error: 'Failed to generate token' ,jwtError});
  }


console.log( "user :",user,'token',token)
      return   res.status(201).json({user,token} )
    } catch (error) {
        res.status(400).json('error while createing',error.message  )
        
    }


}

export const loginControler = async (req,res)=>{
    const  errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(400).json({error:errors.array()})
    }
    try {
console.log('inside at starting try catch block')
      
      const {email,password} = req.body;
      const user = await  User.findOne({email}).select('+password')
      console.log(user,'inside db ')
      
      if(!user.email){
        return res.status(401).json({message:'user not found in DB'})
      }
console.log('after user find succesfully')
 let isMatch;
   try {
      isMatch = await user.isValidPassword(password);
   } catch (error) {
     console.log('error while comparing password ',error)
   }

console.log('after user insmatch',isMatch)

      if(!isMatch){
        return res.send(401).json({
          message:'invalid password or credentionl'
        })
      }

      const token = await  user.generateJWT()
      if(!token){
        console.log('token not gerated ')
      }
console.log('after token genrate ',token)

 console.log('user and password is working')
 res.token = token;
 console.log(res.token)
res.status(200).json({user,token})

    } catch (error) {
      res.status(400).json({
        error      })
      
    }
}

export const profileControler = async (req,res)=>{

console.log( 'requst in profile controler :')
const {user}  = req


res.status(200).json({user
  
})
}

export const logOutContoler = async (req , res)=>{
  console.log('inside logout controler')
  try { 
    console.log('inside try block');
    const token = req.cookies.token || req.headers.authorization.split(' ',[1]);
 
      const result= await readisClient.set(token,'logout',"EX",60*60*24)
console.log('after redisget :' ,result)

    res.status(200).json({
      message:'Logged out successfully'
    })
  } catch (error) {
    console.log(error)
    console.log('something went wronge  while logout ')
  }
}

export const getAllUsersControler = async(req,res)=>{
   try {
    console.log('inside getAllUserControler ')
    // const {user} = req.body
    console.log('user Obj',req)
    const loggedInUser = await User.findOne({email : req.user.email})


      if (!loggedInUser) {
      return res.status(404).json({ message: 'Logged-in user not found' });
    }

    const allUsers  = await getAllUser({userId:loggedInUser._id})
  console.log('all user list :',allUsers)
    return res.status(200).json({
      message: "All user list",
      list: allUsers
    });
   } catch (error) {
    console.log('something went wroge while finding allUser list')
    throw new Error(error.message)
    
   }
}
