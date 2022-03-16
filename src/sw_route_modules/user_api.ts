import bcrypt from 'bcrypt';
import * as Models from '../sw_interface/interface';
import { RedisClientType } from 'redis';
import jwt from 'jsonwebtoken';
import { passTokenSecret } from './../sw_util/keys';
import UserAction from '../sw_modules/user_modules';
import { v4 as uuidv4 } from 'uuid';
import { ValidationError } from 'apollo-server-express';

interface IUserApi {
    createAccountQ: (userInfo: Models.WorkerInfoRegister,
        t: Models.WorkerNoketInfo) => Promise<string | null>,
    getAccountTypeQ: () => Promise<Models.AccountType[] | null>,
    updateAccountQ: (e: Models.WorkerInfo, t:
        Models.WorkerNoketInfo) => Promise<string | null>,
    updatePasswordQ: (userInfo: Models.WorkerInfoRegister, t:
        Models.WorkerNoketInfo) => Promise<string | null>,
    generatePassword: (userPass: string) => Promise<string>,
    authenticateAccountQ: (userInfo: Models.LoginInfo) =>
        Promise<Models.AccessInfo | null>,
    writeUserInfoRedisClient: (userinfo: Models.WorkerInfo,
        token: string | null) => Promise<void>,
    getUserInfoRedisClient: (userID: string) => Promise<string | null>,
    UserTokenValidate: (token: string | undefined) =>
        Promise<Models.WorkerNoketInfo | null>,
    UserTokenDecode: (token: string | undefined) => Models.WorkerNoketInfo | null
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
            const generatedPass = await this.generatePassword(userInfo.Pass);
            await super.createAccount(userInfo, t, generatedPass);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot create Account! " + error);
        }
    }

    public async getAccountTypeQ(): Promise<Models.AccountType[] | null> {
        try {
            const b: Models.AccountType[] | null = await super.getAccountType();
            return b || null
        } catch (error: any) {
            throw new Error("Cannot get accTypes! " + error);
        }
    }

    public async updateAccountQ(e: Models.WorkerInfo, t:
        Models.WorkerNoketInfo): Promise<string | null> {
        try {
            await super.updateAccount(e, t);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot update Account! " + error);
        }
    }

    public async updatePasswordQ(userInfo: Models.WorkerInfoRegister, t:
        Models.WorkerNoketInfo): Promise<string | null> {
        try {
            userInfo.UserQR = uuidv4();
            const generatedPass = await this.generatePassword(userInfo.Pass);
            await super.updatePassword(userInfo, t, generatedPass);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot update Account password! " + error);
        }
    }
    public async generatePassword(userPass: string): Promise<string> {
        const saltPass = 10;
        const salt: string = bcrypt.genSaltSync(saltPass);
        return await bcrypt.hash(userPass, salt);
    }

    private generateLoginToken(userInfo: Models.WorkerInfo): string | null {
        let accessToken = null;
        if (userInfo) {
            accessToken = jwt.sign({
                uid: userInfo.ID,
                acID: userInfo.AccLvl
            }, passTokenSecret, {
                expiresIn: '8h'
            });
            if (accessToken && userInfo.GIDFull)
                this.writeUserInfoRedisClient(userInfo, accessToken);
        }
        return accessToken;
    }
    public async authenticateAccountQ(userInfo: Models.LoginInfo):
        Promise<Models.AccessInfo | null> {
        try {
            const verifyAccount: Models.UserLoginInfo | null =
                await super.authenticateAccount(userInfo);
            if (verifyAccount) {
                const confirmPass = await bcrypt.compare(userInfo.Pass, verifyAccount.Pass);
                if (confirmPass) {
                    if (verifyAccount.AccLvl !== 1) { //change to new Admin acclvl upon data cleanup
                        throw new ValidationError('Permission Denied!');
                    }
                    const token = this.generateLoginToken(verifyAccount);
                    return {
                        UserInfo: verifyAccount,
                        Noket: token,
                    }
                }
            } throw new ValidationError('wrong username or password!');
        } catch (error: any) {
            throw new Error("Error: " + error);
        }
    }

    public async writeUserInfoRedisClient(userinfo: Models.WorkerInfo,
        token: string | null): Promise<void> {
        if (userinfo && token && userinfo.ID)
            await this.redClient.set(userinfo.ID.toString(), token);
    }

    public async getUserInfoRedisClient(userID: string): Promise<string | null> {
        return await this.redClient.get(userID);
    }

    public async UserTokenValidate(token: string | undefined):
        Promise<Models.WorkerNoketInfo | null> {
        try {
            let tokenData!: Models.WorkerNoketInfo;
            if (token) {
                const tokenCheck = jwt.verify(token, passTokenSecret);
                if (tokenCheck) {
                    tokenData = JSON.parse(JSON.stringify(jwt.decode(token)));
                    const tokenRedis = await this.getUserInfoRedisClient(tokenData.acID.toString());
                    if (tokenRedis) {
                        return tokenData;
                    } else throw new ValidationError('Permission Denied!');

                } return null
            } else {
                throw new ValidationError('Permission Denied!');
            }
        } catch (error: any) {
            throw new ValidationError('Permission Denied!');
        }
    }
    public UserTokenDecode(token: string | undefined): Models.WorkerNoketInfo | null {
        if (token) {
            const decodeToken: Models.WorkerNoketInfo =
                JSON.parse(JSON.stringify(jwt.decode(token)));
            return decodeToken;
        }
        return null
    }
}

export default UserApi