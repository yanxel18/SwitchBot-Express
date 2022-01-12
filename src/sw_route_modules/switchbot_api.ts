/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
import jwt from 'jsonwebtoken';

const accessTokenSecret = "D0CCE3AB48A94445E3F543482E634781936118D35D0441F2895E428CBC28D39386C71267282EF9FBDD84152ED6BCBFD1CB6C39CCC496BED6898C533894E40C49"; 
const swb_action = new SwitchBotAction();
 

export async function getMachineListQ():  Promise<Models.MachineList[]> {
           return await swb_action.getMachineList();
 }

 export async function getRaspiQ():  Promise<Models.Raspi[]> {
     return await swb_action.getRaspi();
}

export async function getQRInfoQ(qr: Models.machineQR):  
     Promise<Models.machineQR[] | null  | string> { 
          const t = await swb_action.getQRInfo(qr) ? generateToken() : null;
          if (t === null) throw new Error('QRコードデータが見つかりません!');
        return  t
}

export function generateToken(): string { 
     const accessToken = jwt.sign({
        test: "UserAdmin"
    }, accessTokenSecret, { expiresIn: '4h' }); 
     return accessToken;
 }
 