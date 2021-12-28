/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import SwitchBotAction from '../sw_modules/switchbot_modules';
import * as Models from '../sw_interface/interface';
const swb_action = new SwitchBotAction();
/*
export async function getMachineList(req: Request, res: Response): Promise<void> {
    try {
         res.status(StatusCodes.OK).json(await swb_action.getMachineList());
    } catch (err: any) {
         res.status(StatusCodes.BAD_REQUEST).json(JSON.parse(`{"result":"${err.message}"}`));
    }
}*/

export async function getMachineListQ():  Promise<Models.MachineList[]> {
           return await swb_action.getMachineList();
 }

 export async function getRaspiQ():  Promise<Models.Raspi[]> {
     return await swb_action.getRaspi();
}

export async function getMachineQR(qr: string):  Promise<Models.machineQR[]> {
     console.log(qr);
     return await swb_action.getMachineQR(qr);
}