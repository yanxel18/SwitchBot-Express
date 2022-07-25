
/* eslint-disable no-console */
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
import { RedisClientType } from 'redis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accessTokenSecret } from './../sw_util/keys';
import { ValidationError } from 'apollo-server-express';
import axios from 'axios';

interface ISwitchbotApi {
     getMachineListForTriggerQ: () => Promise<Models.MachineList[]>,
     getRaspiQ: () => Promise<Models.Raspi[]>,
     getQRInfoQ: (qr: Models.machineQR) =>
          Promise<Models.machineQR[] | null | string | Models.WorkerToken>,
     getWorkerInfoQ: (id: number) => Promise<Models.WorkerInfo>,
     getEventMSGQ: () => Promise<Models.MessageInfo>,
     createEventLogsQ: (e: Models.EventParam, t: Models.WorkerNoketInfo,
          Token: string) => Promise<string | null>,
     getEventMSGListQ: () => Promise<Models.EMessages[] | null>,     
     TokenValidate: (token: string | undefined) => Promise<string | JwtPayload | null>,
     TokenDecode: (token: string | undefined) => Models.WorkerNoketInfo | null,
     writeRedisClient: (qr: Models.MachineUserInfo, token: string | null) => Promise<void>,
     getRedisMachine: (mID: string) => Promise<string | null>
}

class SwitchbotApi extends SwitchBotAction implements ISwitchbotApi {

     private redClient: RedisClientType<any, any>;
     constructor(
          redisClient: RedisClientType<any, any>,
     ) {
          super();
          this.redClient = redisClient;
     }
     public async getMachineListForTriggerQ(): Promise<Models.MachineList[]> {
          return await super.getMachineListForTrigger();
     }

     public async getRaspiQ(): Promise<Models.Raspi[]> {
          return await super.getRaspi();
     }

     public async getQRInfoQ(qr: Models.machineQR): Promise<null | string | Models.WorkerToken> {
          const q = await super.getQRInfo(qr);
          const t = q ? this.generateAccessToken(q) : null;
          if (t === null) throw new Error("データが見つかりません！ もう一度QRスキャンしてください。")
          return {
               ScanInfo: q,
               Noket: t
          }

     }
     public async getWorkerInfoQ(id: number): Promise<Models.WorkerInfo> {
          return (await super.getWorkerInfo(id))[0];
     }
     private generateAccessToken(qr: Models.MachineUserInfo): string | null {
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
     public async getEventMSGQ(): Promise<Models.MessageInfo> {
          const q: Models.EMessages[] = await super.getEventMSG();
          if (!q) throw new Error("イベントを取得できません！");
          return {
               messages: q,
               error: []
          }
     }

     public async getEventMSGListQ(): Promise<Models.EMessages[] | null> {
          const q: Models.EMessages[] = await super.getEventMSGList();
          if (!q) throw new Error("イベントを取得できません！");
          return q
     }
     public async createEventLogsQ(e: Models.EventParam, t:
          Models.WorkerNoketInfo, Token: string): Promise<string | null> {
          try {
               const m: Models.MachineList | undefined =
                    (await this.getMachineListForTrigger()).find(x => x.machineID === t.mID);
               const p: Models.EventParam = {
                    ...e,
                    userid: t.uid,
                    mID: t.mID,
                    sbid: t.sID
               }
               if (m && m.raspiServer) {
                    const switchbotResponse = await axios.post(m.raspiServer, {
                         mac: m.switchbotMac
                    }, {
                         headers: {
                              'Authorization': `Bearer ${Token}`
                         }
                    }).then(() => {
                         return "success";
                    });
                    if (switchbotResponse === "success") {
                         await super.createEventLogs(p);
                         return switchbotResponse;
                    }

               } return null;
          } catch (error: any) {
               throw new Error("Cannot trigger switchbot! Check RaspiAPI server! " + error);
          }

     }
     public async TokenValidate(token: string | undefined):
          Promise<Models.WorkerNoketInfo | null> {
          try {
               let tokenData!: Models.WorkerNoketInfo;
               if (token) {
                    const tokenCheck = jwt.verify(token, accessTokenSecret);
                    if (tokenCheck) {
                         tokenData = JSON.parse(JSON.stringify(jwt.decode(token)));
                         const tokenRedis = await this.getRedisMachine(tokenData.mID.toString());
                         if (tokenRedis) {
                              return tokenData;
                         } else throw new ValidationError('Error occured! Unauthorized! Code: 401');

                    } return null
               } else {
                    throw new ValidationError('Unauthorized! Code: 401');
               }
          } catch (error: any) {
               throw new ValidationError('Unauthorized! Code: 401');
          }
     }
     public TokenDecode(token: string | undefined): Models.WorkerNoketInfo | null {
          if (token) {
               const decodeToken: Models.WorkerNoketInfo =
                    JSON.parse(JSON.stringify(jwt.decode(token)));
               return decodeToken;
          }
          return null
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

export default SwitchbotApi