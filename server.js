import http from'http'

import dotenv from 'dotenv'
dotenv.config()
import {app} from './app.js'
import  {Server} from 'socket.io'
import  jwt  from 'jsonwebtoken'
import mongoose from 'mongoose'
import Project from './models/projec.model.js'
import { isAsyncFunction } from 'util/types'
import AiService from './services/ai.service.js'
const server = http.createServer(app);
const io =  new Server(server,{
  cors:{
    origin:"*"
  }
});


io.use( async (socket,next)=>{
  try {
      
    const token =  socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(" ")[1]


    const projectId = socket.handshake.query.projectId;

    if(!mongoose.Types.ObjectId.isValid(projectId)){
      return next(new Error('invalid project ID or not match with mongoose id'
      ))
    }
    socket.project = await Project.findById(projectId)
    if(!token){
      return next(new Error("Authentication error"))
    }
    const user = jwt.verify(token,process.env.JWT_SECRET);

    if(!user){
      return next(new Error('Authentication error even token  is present'));

    }
    socket.user = user
    next()
  } catch (error) {
    next(error)

    
  }

})
io.on('connection',socket =>{
  console.log('user connected to server');

  socket.roomId = socket.handshake._id

  socket.join(socket.roomId);

  socket.on('project-message', async data =>{
    const message = data.message

    const  aiIsPresentInMessage = message.includes("@ai")

       socket.broadcast.to(socket.roomId).emit('project-message', {
      message,
      sender: { _id: socket.user._id, email: socket.user.email }
    });

    
    if(aiIsPresentInMessage){
      const prompt = message.replace('@ai',' ');
      // handle AI prompt if needed
      const reuslt = await AiService(prompt)

      io.to(socket.roomId).emit('project-message',{
        message: reuslt,
        sender:{
          _id:'ai',
          email:'AI'
        }
      })

    }

 
  });

  socket.on('disconnect',data =>{console.log('user disconected')
    socket.leave(socket.roomId)
  } )
})

// const serverSocket = http.createServer(app)


app.get('/', (req, res) => {
  res.send('Hello World');
});

server.listen(process.env.PORT,()=>{
    console.log('server is running on port ' ,process.env.PORT)
})