import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Make sure these environment variables exist
const host = process.env.REDIS_HOST || "localhost";
const port = process.env.REDIS_PORT || "6379";
const password = process.env.REDIS_PASSWORD || "";

const redisUrl = password
  ? `redis://:${password}@${host}:${port}`
  : `redis://${host}:${port}`;

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
