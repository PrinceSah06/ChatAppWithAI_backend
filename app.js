import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan';
import connect from './Db/Db.js';
import   userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import projectRoutes from './routes/project.routes.js'
connect()

import express from 'express'

 export const app = express();
 app.use(morgan('dev'))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser())
app.use('/user',userRoutes)
app.use("/projects",projectRoutes)