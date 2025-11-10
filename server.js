import http from'http'

import dotenv from 'dotenv'
dotenv.config()
import {app} from './app.js'

const server = http.createServer(app)


app.get('/', (req, res) => {
  res.send('Hello World');
});

server.listen(process.env.PORT,()=>{
    console.log('server is running on port ' ,process.env.PORT)
})