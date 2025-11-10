import Radis, { Redis } from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const readisClient = new Radis({
    host :process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
});



readisClient.on('connect',()=>{
    console.log('Readis connected');
});

export default  readisClient