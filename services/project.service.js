import { useId } from "react";
import Project from "../models/projec.model.js";
import mongoose, { mongo } from "mongoose";

export const  createProject = async({name,userId})=>{

    if(!name ){
        throw new Error('Name is required')

    }
    if(!user ){
        throw new Error('User is required')

    }
let project;

  try {


       project = await Project.create({
          name,users:{userId}
      })
  } catch (error) {
    if(error.code ===11000){
    throw new Error('Project name already Exists');

    }
    throw error

    
  }

  return project









}

export const getAllProjectByUserId = async ({userId})=>{
  if(!useId){
    throw new Error('userId  is required ')
  }

  const allUserProjects = await Project.find({
    users:userId
  });
  return allUserProjects
}

export const addUserToProjects = async ({projectId,users,userId})=>
{
  if(!projectId){
    throw new Error('projectId  is required')
  }
    if(!users){
    throw new Error('users  is required')
  }

  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error ('Invalid ProjectId')
  }

  if(!Array.isArray(users) || users.some(userId =>
    !mongoose.Types.ObjectId.isValid(userId)
  )){
    throw new Error('Invaled userId(s) in user array')
  }


  const project = await Project.findOne({ _id :projectId,users:userId
    
  })
  if(!project){
    throw new Error('user not  belonge to this project')
  }

  const updatedProject = await Project.findOneAndUpdate({_id :projectId},{$addToSet:{
    users:{
      $each:users
    }
  }},{new:true})

  return updatedProject


}
