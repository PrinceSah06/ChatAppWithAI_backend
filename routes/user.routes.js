import { Router } from "express";
import * as userConstroler from '../constolers/user.controler.js'
import { body } from "express-validator";
const router = Router()
import { authUser } from "../middleware/auth.middleware.js";

router.post('/register',
    body('email').isEmail().withMessage('Email mist be a vaild address'),
    body('password').isLength({min:4}).withMessage('password mist be a at least 4 charactor')
,userConstroler.createUserControler);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
        body('password').isLength({min:4}).withMessage('password mist be a at least 4 charactor')
,userConstroler.loginControler);

router.get('/login/profile',authUser,userConstroler.profileControler)


router.get('/logout',authUser,userConstroler.logOutContoler)





 

export default router;