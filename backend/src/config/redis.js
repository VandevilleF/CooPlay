import { createClient } from 'redis';
import { config } from './environment.js';

const redisClient = createClient({ url: config.redisUrl });

redisClient.on('error', (err) => console.error('Redis Error', err));
redisClient.on('connect', () => console.log('Redis connected'));

await redisClient.connect();

export default redisClient;
