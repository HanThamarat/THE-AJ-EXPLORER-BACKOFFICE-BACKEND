import redisClient from "../database/redis"

export class CacheHelper {
    static async setCache(key: string, value: string) {
        await redisClient.set(key, value);
    }

    static async getCache(key: string) {
        return await redisClient.get(key);
    }

    static async deleteCache(key: string) {
        return await redisClient.del(key);
    }
}