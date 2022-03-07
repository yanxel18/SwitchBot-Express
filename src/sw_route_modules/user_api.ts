/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
import { RedisClientType } from 'redis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accessTokenSecret } from './../sw_util/keys';
import UserAction from '../sw_modules/user_modules';
import { v4 as uuidv4 } from 'uuid';

interface IUserApi {
    generatePassword: (userPass: string) => Promise<string>
}

class UserApi extends UserAction implements IUserApi {
    private redClient: RedisClientType<any, any>;
    constructor(
        redisClient: RedisClientType<any, any>,
    ) {
        super();
        this.redClient = redisClient;
    }

    public async createAccountQ(userInfo: Models.WorkerInfoRegister, 
        t: Models.WorkerNoketInfo): Promise<string | null> {
        try {
            userInfo.UserQR = uuidv4();
            const generatedPass= await this.generatePassword(userInfo.Pass);
            await super.createAccount(userInfo,t, generatedPass);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot create Account! " + error);
        }
    }

    public async getAccountTypeQ(): Promise<Models.AccountType[] | null> {
        try {
            const b: Models.AccountType[] | null = await super.getAccountType();
            console.log(b);
            return b || null
        } catch (error: any) {
            throw new Error("Cannot get accTypes! " + error);
        }
    }
    public async generatePassword(userPass: string): Promise<string> {
        const saltPass = 10;
        const salt: string = bcrypt.genSaltSync(saltPass);
        return await bcrypt.hash(userPass, salt);
    }

    private generateAccountAccessToken(qr: Models.MachineUserInfo): string | null {
        let accessToken = null;
        if (qr) {
            accessToken = jwt.sign({
                uid: qr.UInfo[0].ID,
                mID: qr.machineID,
                rID: qr.raspiID,
                sID: qr.switchbotID,
                acID: qr.UInfo[0].AccLvl
            }, accessTokenSecret, {
                expiresIn: '8h'
            });
            if (accessToken) this.writeRedisClient(qr, accessToken);
        }
        return accessToken;
    }

    public async writeRedisClient(qr: Models.MachineUserInfo,
        token: string | null): Promise<void> {
        if (qr && token && qr.machineID) await this.redClient.set(qr.machineID.toString(), token);
    }

    public async getRedisMachine(mID: string): Promise<string | null> {
        const t = await this.redClient.get(mID);
        return t;
    }
}

export default UserApi