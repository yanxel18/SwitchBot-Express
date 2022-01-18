
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */

/* eslint-disable no-console */
import jwt, { JwtPayload } from "jsonwebtoken";
import { accessTokenSecret } from "./keys";
import { RedisClientType } from 'redis';

export interface ITokenizerRedis {
    Tokenizer: (token: string | undefined) =>string | JwtPayload | null | undefined
}
class TokenizerRedis implements ITokenizerRedis{

    private redClient: RedisClientType<any, any>;
    constructor(
        redisClient: RedisClientType<any, any>
    ) {

        this.redClient = redisClient;
    }

    public Tokenizer(token: string | undefined): 
        string | JwtPayload | null | undefined {
        try { 
            if (token) {
                // this.redClient.set('3333', 'token');
                //const c = await getRedisAsync(token);
               //console.log(jwt.verify(token?.split(' ')[1], accessTokenSecret,))
                //console.log(await this.redClient.get('3333'));
              return token;
                //return jwt.verify(token?.split(' ')[1], accessTokenSecret);
            }
        } catch (error: any) {
            return null;
        }
    }

}

export default TokenizerRedis


