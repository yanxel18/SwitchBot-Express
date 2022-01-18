
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
import jwt from 'jsonwebtoken';
import { accessTokenSecret } from './../sw_util/keys';

interface ISwitchbotApi {
     getMachineListQ: () => Promise<Models.MachineList[]>,
     getRaspiQ: () => Promise<Models.Raspi[]>,
     getQRInfoQ: (qr: Models.machineQR) => 
          Promise<Models.machineQR[] | null | string | Models.WorkerToken>,
     getWorkerInfoQ: (p: Models.WorkerNoketInfo) => Promise<Models.WorkerInfo>

}

class SwitchbotApi extends SwitchBotAction implements ISwitchbotApi {

     public async getMachineListQ(): Promise<Models.MachineList[]> {
          return await super.getMachineList();
     }

     public async getRaspiQ(): Promise<Models.Raspi[]> {
          return await super.getRaspi();
     }

     public async getQRInfoQ(qr: Models.machineQR):  Promise<null | string | Models.WorkerToken> {
          const q = await super.getQRInfo(qr);
          const t = q ? this.generateAccessToken(q) : null;
     
               if (t === null) return {
                    Noket:null,
                   error :[{
                        message: "Not Found!"
                   }]
                    
               };
               return { 
                    Noket: t,
                    error: []
               }
          
     }

     public async getWorkerInfoQ(p: Models.WorkerNoketInfo): Promise<Models.WorkerInfo> {
          const  { id } = p; 
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
          }
          return accessToken;
     }
}

export default SwitchbotApi