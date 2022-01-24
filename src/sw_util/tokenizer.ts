
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */

/* eslint-disable no-console */
import jwt, { JwtPayload } from "jsonwebtoken";
import { accessTokenSecret } from "./keys";
import { RedisClientType } from 'redis';
import * as Models from '../sw_interface/interface';
export interface ITokenizerRedis {
    TokenValidate: (token: string | undefined) =>string | JwtPayload | null | undefined
}
class TokenizerRedis implements ITokenizerRedis{

    private redClient: RedisClientType<any, any>; 
    constructor(
        redisClient: RedisClientType<any, any>, 
    ) { 
        this.redClient = redisClient; 
    }

    public TokenValidate(token: string | undefined): 
        string | JwtPayload | null | undefined {
        try { 
            if (token) {
                console.log(jwt.verify(token,accessTokenSecret))
                    
               
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

    public async writeRedisClient(qr: Models.MachineUserInfo, token: string | null): Promise<void>{
       if (qr && token) await this.redClient.set(qr.machineName, token);
    }
    public async test(): Promise<string | null> {
        const t = await this.redClient.get('3333');
        return t;
    }

}

export default TokenizerRedis


