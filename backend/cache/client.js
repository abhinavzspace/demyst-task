import { createClient } from "redis";

/* pulls the Redis URL from .env */
const url = process.env.REDIS_URL;
const redis = createClient({ url });
redis.on("error", (err) => console.log("Redis Client Error", err));
await redis.connect();

export default redis;
