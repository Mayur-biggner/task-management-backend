// redisClient.js
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || 'zXf6Wxhg4b0XIKGD1cvcExZfTmEm92mG',
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();

export default redisClient;
