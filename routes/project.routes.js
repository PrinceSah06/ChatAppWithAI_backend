import {Router} from "express"
import { body } from "express-validator";
import  {createProject} from '../constolers/project.controler.js'
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();

router.post('/create',authUser,body("name").isString()
.withMessage('Name is required')),createProject



router.get('/all',authUser,getAppProject)

router.put('/add-user',body('projectId').isString().withMessage('project  is  required'),
    body('users').isArray().apply({min:1}).withMessage('Users must be an array ')
.custom((users)=>users.every((user) => {typeof user ==='string'})
.withMessage('Each user must be string')),
 addUserToProject)


export  default router