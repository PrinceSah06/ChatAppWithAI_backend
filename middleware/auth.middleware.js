import dotenv from 'dotenv'
dotenv.config()


import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

import readisClient from '../services/radis.servies.js';

export const authUser = async (req, res, next) => {
  let token;

  // Try to get token from cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Else, try to get token from Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract token part after "Bearer "
  }
  if (!token) {
    return res.status(401).send({ err: "please authenticate", error: { message: "jwt must be provided" } });
  }

  console.log('token :' ,token)
  const isBlacklisted = await readisClient.get(token)
  console.log(isBlacklisted)
  

  if(isBlacklisted){
    // res.clearcookies('token',"")
    return res.status(401).send({error:'Unauthorized user'})
  }
  try {
    // Verify token with secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ensure JWT_SECRET is set correctly in your env
    req.user = decoded; // attach decoded token payload to request for downstream use
    console.log('this User is authrised')
    next(); // pass control to next middleware/controller
  } 
  catch (error)
  {
    console.log('Token verification error:', error);
    return res.status(401).send({ err: "please authenticate", error });
  }

};
