import Project from "../models/projec.model.js";
import { validationResult } from 'express-validator'
import { addUserToProjects, getAllProjectByUserId, createProject as projectService } from "../services/project.service.js";
import User from '../models/user.models.js'
import { getAllUser } from "../services/user.services.js";
import {getProjectByIdServices} from "../services/project.service.js"


export const createProject = async (req, res) => {
    console.log('...............inside create project...............')
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.isEmpty() })

    }


    try {
        const { name } = req.body;
        const logedInUser = await User.findOne({ email: req.user.email });
        const userId = logedInUser._id;

        const newProject = await projectService({ name, userId })
        console.log('Project created')
        res.status(200).json(newProject)

    } catch (error) {
        console.log('Error while creating Project ')
        console.log(error)
        res.status(400).send(error.message)


    }



}

export const getAllProject = async (req, res) => {
    console.log('all user controler')
    // console.log(req.user,'this is whole reqest obj',req)
      let allUserProjects ;
    try {
        const loggedInUser = await User.findOne({
            email: req.user.email,
        })
try {
    
             allUserProjects = await  getAllProjectByUserId({ userId: loggedInUser._id });
             console.log('this is all project data from getallProjectservices')

              return res.status(200).json({
            projects: allUserProjects
        })
    
} catch (error) {
    console.log(error)
    console.log('error while geting all project')
    
}
       


    } catch (error) {
        console.log(error)
        res.status(404).json({ err: 'errror while get all project ' }, error.message)

    }
}
export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    try {

        const { projectId, users } = req.body
    console.log("ProjectId  inside addUserToProject",projectId)
    console.log("Users  inside addUserToProject",users)


        const loggedInUser = await User.findOne({
            email: req.user.email

        })
        const project = await addUserToProjects({
            projectId, users, userId: loggedInUser._id
        })


        return res.status(200).json({
            project
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: ' Error while  adding new user to project' }, { error })
    }











}

export const getProjectById =async (req,res)=>{
     
    const {projectId} = req.params;

            try {
            const project = await getProjectByIdServices({ projectId })

            return res.status(200)
            .json({project,message:'successfully find projects'})
            } catch (error) {
        console.error('Error in getProjectById:', error);
        res.status(500).json({ message: 'Error fetching project', error: error.message });


}}