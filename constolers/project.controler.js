import Project from "../models/projec.model.js";
import {validationResult} from 'express-validator'
import { createProject as projectService } from "../services/project.service.js";
import User from '../models/user.models.js'


export const createProject = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.isEmpty})

    }

   
      try { 
 const {name} = req.body;
    const logedInUser =  await User.findById({email:req.user.email});
    const userId = logedInUser._id;

    const newProject = await projectService({name,userId})  
     console.log('Project created')
    res.status(200).json(newProject)
        
    } catch (error) {
        console.log('Error while creating Project ')
        console.log(error)
        res.status(400).send(error.message)

        
    }


    
}

export const getAllProject = async (req , res )=>{
   try {
    const loggedInUser = await User.findOne({
      email:req.user.email,
    })

    const allUserProjects = await getAllProject({userId : loggedInUser._id} )

 return res.status(200).json({
    projects:allUserProjects
 })
    
    
   } catch (error) {
    console.log(error)
    res.status(404).json({err:'errror while get all project '},error.message)
    
   }
}
export const  addUserToProject = async ( req,res)=>{
     const errors = validationResult(req);
     if(!errors.isEmpty()){
         return  res.status(400).json({errors : errors.array()})
     }


try {

    const {projectId ,users}  = req.body

    const loggedInUser = await User.findOne({email:req.user.email

    })
    const project = await addUserToProject({
      projectId,users,userId:loggedInUser._id  
    })


    return res.status(200).json({
        project
    })
} catch (error) {
 console.log(error)
 res.status(400).json({message : ' Error while  adding new user to project'},{error})   
}











    }
