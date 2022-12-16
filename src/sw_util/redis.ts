/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-misused-promises */
import * as redis from 'redis';
import { RedisClientType } from 'redis';

interface IRedisClient {
    initializeClient: () => RedisClientType<any, any>,
    executeRedis: () => Promise<void>
}
class RedisClient implements IRedisClient {

    public client = this.initializeClient();

    constructor() {
        this.executeRedis();
        this.callback();
    }
    public initializeClient(): RedisClientType<any, any> {
        return redis.createClient({
            socket:{
                host: '127.0.0.1',
                port: 6379
            }
        })
    }
    public async executeRedis(): Promise<void> {
        await this.client.connect();
    }
    private callback(): void {
        this.client.on("connect", function () {
            console.log("Redis plugged in.");
        });
        this.client.on("error", function (error: any) {
            console.log(error);
        });
    }
}

export default RedisClient