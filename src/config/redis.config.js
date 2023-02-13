import { createClient } from 'redis';
import { promisify } from 'util';

const redisClient = createClient(6379, process.env.REDIS_HOST, {
  no_ready_check: true,
});

const rpushAsync = promisify(redisClient.rPush).bind(redisClient);
const lrangeAsync = promisify(redisClient.lRange).bind(redisClient);

const expireRedis = promisify(redisClient.expire).bind(redisClient);

export { redisClient, rpushAsync, lrangeAsync, expireRedis };
