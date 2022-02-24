/* eslint-disable no-console */
import * as Models from '../sw_interface/interface';
import { Request } from 'express';
import Context from './context';
const resolvers = {
    Query: {
        MachineList:  async (_: any, __: any, { SwitchbotAPI, ControlPanelAPI, Token }: Context): 
            Promise<Models.Machine[] | []> => {
            return await SwitchbotAPI.TokenValidate(Token) ?
                await ControlPanelAPI.getMachineListQ()  : []
        },
        Machine: async (parent: any, args: Models.MachineArg,
            { SwitchbotAPI, Token }: Context): Promise<Models.MachineList | undefined | []> => {
            return await SwitchbotAPI.TokenValidate(Token) ?
                (await SwitchbotAPI.getMachineListForTriggerQ())
                    .find(x => x.machineID === args.id) : []
        },
        MachineFilter: (_: any, args: Models.MachineFilter, { SwitchbotAPI }: Context):
            Models.MachineList[] => {
            const { machineID } = args.filter;
            /* const source = await SwitchbotAPI.getMachineListQ();
             if (machineID) {
                 return source.filter(x => x.machineID === machineID);
             }
             return source;*/
            return [];
        },
        RaspiList: async (_: any, ___: any, { SwitchbotAPI, ControlPanelAPI, Token }:
            Context): Promise<Models.Raspi[]> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            return await SwitchbotAPI.TokenValidate(Token) && t && Token ?
                SwitchbotAPI.getRaspiQ() : [];
        },
        SwitchBot: async (_: any, __: any, { SwitchbotAPI, ControlPanelAPI, Token }: Context):
            Promise<Models.SwitchBot[] | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            return await SwitchbotAPI.TokenValidate(Token) && t && Token ?
                ControlPanelAPI.getSwitchbotListQ() : null;
        },
        EventMsg: async (_: any, __: any, { SwitchbotAPI, Token }: Context):
            Promise<Models.MessageInfo | null> => {
            return await SwitchbotAPI.TokenValidate(Token) ?
                await SwitchbotAPI.getEventMSGQ() : null;
        }
    },
    Mutation: {
        createEventLogs: async (_: any, args: Models.ArgsInput,
            { SwitchbotAPI, Token }: Context): Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            return await SwitchbotAPI.TokenValidate(Token) && t && Token ?
                await SwitchbotAPI.createEventLogsQ(args.input, t, Token) : null;
        },
        WorkerToken: async (_: any, args: Models.machineQR, { SwitchbotAPI }: Context)
            : Promise<string | null | Models.WorkerToken> => {

            return await SwitchbotAPI.getQRInfoQ(args);
        },
        createSwitchBot: async (_: any, args: Models.SwitchbotArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                const x = (await ControlPanelAPI.getSwitchbotListQ())?.
                    find(x => x.switchbotMac === args.input.switchbotMac);
                return x ? "duplicate" : await ControlPanelAPI.createSwitchBotQ(args.input, t);
            }
            return null
        },
        deleteSwitchBot: async (_: any, args: Models.SwitchbotDeleteArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                return await ControlPanelAPI.deleteSwitchbotQ(args.input, t);
            }
            return null;
        },
        updateSwitchBot: async (_: any, args: Models.SwitchbotArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            console.log(args);
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                const a = ((await ControlPanelAPI.getSwitchbotListQ())?.
                    filter(b => b.switchbotID !== args.input.switchbotID))?.
                    filter(c => c.switchbotMac === args.input.switchbotMac);
                if (a) if (a.length > 0) return "duplicate";
                return await ControlPanelAPI.updateSwitchbotQ(args.input, t);
            }
            return null
        },
        updateRaspi: async (_: any, args: Models.RaspiArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                const a = ((await SwitchbotAPI.getRaspiQ())?.
                    filter(b => b.raspiID !== args.input.raspiID))?.
                    filter(c => c.raspiServer === args.input.raspiServer);
                if (a) if (a.length > 0) return "duplicate";
                return await ControlPanelAPI.updateRaspiQ(args.input, t);
            }
            return null;
        },
        createRaspi: async (_: any, args: Models.RaspiCreateArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                const a = ((await SwitchbotAPI.getRaspiQ())?.
                    filter(b => b.raspiID !== args.input.raspiID))?.
                    filter(c => c.raspiServer === args.input.raspiServer);
                if (a) if (a.length > 0) return "duplicate";
                return await ControlPanelAPI.createRaspiQ(args.input, t);
            }
            return null
        },
        deleteRaspi: async (_: any, args: Models.RaspiDeleteArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                return await ControlPanelAPI.deleteRaspiQ(args.input, t);
            }
            return null;
        },
        createMachine: async (_: any, args: Models.CreateMachineArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) {
                const a = ((await ControlPanelAPI.getMachineListQ())?.
                    filter(b => b.machineName === args.input.machineName &&
                        (b.machineModel === args.input.machineModel)));
                if (a) if (a.length > 0) return "duplicate";
                return await ControlPanelAPI.createMachineQ(args.input, t);
            }
            return null;
        },
        updateMachine: async (_: any, args: Models.UpdateMachineArgs,
            { ControlPanelAPI, SwitchbotAPI, Token }: Context):
            Promise<string | null> => {
            const t = SwitchbotAPI.TokenDecode(Token);
            if (await SwitchbotAPI.TokenValidate(Token) && t && Token) { 
                const a = ((await ControlPanelAPI.getMachineListQ())?.
                    filter(b => b.machineID !== args.input.machineID))?.
                    filter(c => c.machineName === args.input.machineName &&
                        c.machineModel === args.input.machineModel);
                if (a) if (a.length > 0) return "duplicate";
                return await ControlPanelAPI.updateMachineQ(args.input, t); 
            }
            return null
        }
    },
    Machine: {
        RaspiList: async (parent: Models.MachineArg, w_: any,
            { SwitchbotAPI }: Context)
            : Promise<Models.Raspi[]> => {
            const { raspiID } = parent;
            return ((await SwitchbotAPI.getRaspiQ())).filter(x => x.raspiID === raspiID);
        }
    },
    SwitchBot: {
        RaspiList: async (parent: Models.SwitchBot, w_: any,
            { SwitchbotAPI }: Context)
            : Promise<Models.Raspi[]> => {
            const { switchbotRaspiID } = parent;
            return ((await SwitchbotAPI.getRaspiQ())).filter(x => x.raspiID === switchbotRaspiID);
        }
    }
}

export default resolvers