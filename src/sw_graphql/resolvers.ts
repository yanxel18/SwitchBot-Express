/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
import * as Models from '../sw_interface/interface';
import { Request, Response } from 'express';
import Context from './context';
import axios from 'axios';
const resolvers = {
    Query: {
        MachineList: () =>
            (_: any, args: Models.MachineArg, { SwitchbotAPI }: Context,
                { req }: { req: Request }): Models.MachineList[] => {
                /*
        try {
            console.log(req);
            return await SwitchbotAPI.getMachineListQ();
        } catch (err: any) {
            throw new Error(err);
        }*/
                return []

            },
        Machine: async (parent: any, args: Models.MachineArg,
            { SwitchbotAPI, Token }: Context): Promise<Models.MachineList | undefined | []> => {
            return await SwitchbotAPI.TokenValidate(Token) ?
                (await SwitchbotAPI.getMachineListQ()).find(x => x.machineID === args.id) : []
        },
        MachineFilter: (_: any, args: Models.MachineFilter, { SwitchbotAPI }: Context):
            Models.MachineList[] => {
            const { machineID } = args.filter;
            /* const source = await SwitchbotAPI.getMachineListQ();
             if (machineID) {
                 return source.filter(x => x.machineID === machineID);
             }
             return source;*/
            return []
        },

        EventMsg: async (_: any, __: any, { SwitchbotAPI, Token }: Context):
            Promise<Models.MessageInfo | null> => { 
            return await SwitchbotAPI.TokenValidate(Token) ?
                await SwitchbotAPI.getEventMSGQ() : null;
        }
    },
    Mutation: {
        createEventLogs: async (_: any, args: Models.ArgsInput, 
                            { SwitchbotAPI, Token }: Context) => { 
            const t = SwitchbotAPI.TokenDecode(Token);
            return await SwitchbotAPI.TokenValidate(Token) && t && Token?
                await SwitchbotAPI.createEventLogsQ(args.input, t, Token) : null;
        },
        WorkerToken: async (_: any, args: Models.machineQR, { SwitchbotAPI }: Context)
            : Promise<string | null | Models.WorkerToken> => { 
         
            return await SwitchbotAPI.getQRInfoQ(args);
        }
    },
    Machine: {
        RaspiList: async (parent: Models.MachineArg, w_: any,
            { SwitchbotAPI }: Context)
            : Promise<Models.Raspi[]> => {
            const { raspiID } = parent;
            return ((await SwitchbotAPI.getRaspiQ())).filter(x => x.raspiID === raspiID);
        }

    }
}

export default resolvers