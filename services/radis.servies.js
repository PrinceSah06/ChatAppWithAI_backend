import Redis from 'ioredis';

let redisClient;

if (process.env.REDIS_URI) {
    redisClient = new Redis(process.env.REDIS_URI);
} else if (process.env.REDIS_HOST) {
    redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD || undefined,
    });
} else {
    console.warn('Warning: Neither REDIS_URI nor REDIS_HOST is specified. Falling back to default localhost:6379.');
    redisClient = new Redis();
}

redisClient.on('connect', () => {
    console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export default redisClient;