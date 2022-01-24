
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
import { RedisClientType } from 'redis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accessTokenSecret } from './../sw_util/keys';

interface ISwitchbotApi {
     getMachineListQ: () => Promise<Models.MachineList[]>,
     getRaspiQ: () => Promise<Models.Raspi[]>,
     getQRInfoQ: (qr: Models.machineQR) =>
          Promise<Models.machineQR[] | null | string | Models.WorkerToken>,
     getWorkerInfoQ: (p: Models.WorkerNoketInfo) => Promise<Models.WorkerInfo>,
     TokenValidate: (token: string | undefined) => string | JwtPayload | null | undefined
}

class SwitchbotApi extends SwitchBotAction implements ISwitchbotApi {

     private redClient: RedisClientType<any, any>;
     constructor(
          redisClient: RedisClientType<any, any>,
     ) {
          super();
          this.redClient = redisClient;
     }
     public async getMachineListQ(): Promise<Models.MachineList[]> {
          return await super.getMachineList();
     }

     public async getRaspiQ(): Promise<Models.Raspi[]> {
          return await super.getRaspi();
     }

     public async getQRInfoQ(qr: Models.machineQR): Promise<null | string | Models.WorkerToken> {
          const q = await super.getQRInfo(qr);
          const t = q ? this.generateAccessToken(q) : null;
          if (t === null)
               return {
                    Noket: null,
                    error: [{ message: "データが見つかりません！ もう一度QRスキャンしてください。" }]
               };
          return {
               Noket: t,
               error: []
          }

     }

     public async getWorkerInfoQ(p: Models.WorkerNoketInfo): Promise<Models.WorkerInfo> {
          const { id } = p;
          return (await super.getWorkerInfo(id))[0];
     }
     private generateAccessToken(qr: Models.MachineUserInfo): string | null {
          let accessToken = null;
          if (qr) {
               accessToken = jwt.sign({
                    id: qr.UInfo[0].ID,
                    mID: qr.machineID,
                    rID: qr.raspiID,
                    acID: qr.UInfo[0].AccLvl
               }, accessTokenSecret, {
                    expiresIn: '1h'
               });
               if (accessToken) this.writeRedisClient(qr, accessToken);
          }
          return accessToken;
     }
     public async getEventMSGQ(): Promise<Models.MessageInfo> {
          const q: Models.EMessages[] = await super.getEventMSG();

          if (q === null) return {
               messages: [],
               error: [{
                    message: "Not Event Message!"
               }]

          };
          return {
               messages: q,
               error: []
          }

     }

     public async TokenValidate(token: string | undefined):
          Promise<Models.WorkerNoketInfo | null | undefined> {
          try {
               let tokenData! : Models.WorkerNoketInfo;
               if (token) {
                    const tokenCheck = jwt.verify(token, accessTokenSecret);
                    if (tokenCheck) {
                           tokenData  =
                              JSON.parse(JSON.stringify(jwt.decode(token)));
                         const tokenRedis = await this.getRedisMachine(tokenData.mID.toString());
                         console.log(tokenRedis); 
                    }
                    


                    // this.redClient.set('3333', 'token');
                    //const c = await getRedisAsync(token);
                    //console.log(jwt.verify(token?.split(' ')[1], accessTokenSecret,))
                    //console.log(await this.redClient.get('3333'));
                    return tokenData  ;
                    //return jwt.verify(token?.split(' ')[1], accessTokenSecret);
               }
          } catch (error: any) {
               throw new Error('test error!');
          }
     }

     public async writeRedisClient(qr: Models.MachineUserInfo,
          token: string | null): Promise<void> {
          if (qr && token) await this.redClient.set(qr.machineName, token);
     }
     public async getRedisMachine(mID: string): Promise<string | null> {
          const t = await this.redClient.get(mID);
          return t;
     }
}

export default SwitchbotApi