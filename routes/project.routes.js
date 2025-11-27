import {Router} from "express"
import { body } from "express-validator";
import {addUserToProject,getProjectById} from '../constolers/project.controler.js'
import  {createProject,getAllProject} from '../constolers/project.controler.js'
import { authUser } from "../middleware/auth.middleware.js";
import {getAllUsersControler} from '../constolers/user.controler.js'
const router = Router();

router.post('/create',authUser,body("name").isString()
.withMessage('Name is required'),createProject)



router.get('/all',authUser,getAllProject)

router.put('/add-user',authUser,body('projectId').isString().withMessage('project  is  required'),
body('users').isArray({ min: 1 }).withMessage('Users must be an array')
     .custom(users => users.every(user => typeof user === 'string'))
     .withMessage('Each user must be string'), addUserToProject)




 router.get("/get-project/:projectId",authUser,getProjectById)
export  default router