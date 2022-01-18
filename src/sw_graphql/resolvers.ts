/* eslint-disable @typescript-eslint/no-unsafe-argument */ 
/* eslint-disable no-console */
import * as Models from '../sw_interface/interface'; 
import { Request, Response } from 'express'; 
import Context from './context';
 
const resolvers = {
    Query: {
        MachineList: async function MachineList
        (_: any, args: Models.MachineArg, {SwitchbotAPI} : Context, 
            {req }: {req: Request}): 
        Promise<Models.MachineList[]> {
            try {
                console.log(req);
               return  await SwitchbotAPI.getMachineListQ();
            }catch (err: any){
                throw new Error(err);
            }
            
        },
        Machine: async function Machine(_: any, args: Models.MachineArg, {SwitchbotAPI} :
            Context): 
            Promise<Models.MachineList | undefined> {
            const { id } = args; 
            return (( await SwitchbotAPI.getMachineListQ()).find(x=> x.machineID === id))
        },
        MachineFilter: async function Machines(_: any, args: Models.MachineFilter,
            {SwitchbotAPI} : Context):
            Promise<Models.MachineList[]>{
                const { machineID} = args.filter;
                const source = await SwitchbotAPI.getMachineListQ(); 
                    if (machineID){  
                        return source.filter(x=> x.machineID === machineID);
                    } 
                    return source;
            }, 
        WorkerToken: async function generateToken(_: any, args: Models.machineQR, 
             {SwitchbotAPI , Tokenizer}: Context) 
            : Promise<string| null | Models.WorkerToken>{
                console.log(Tokenizer);
            return  await SwitchbotAPI.getQRInfoQ(args);
        } 
    },
    Machine : {
        RaspiList:  async function RaspiList(parent: Models.MachineArg, _: any, 
            {SwitchbotAPI } : Context) 
        : Promise<Models.Raspi[]>{ 
            const { raspiID} = parent;
            return ((await SwitchbotAPI.getRaspiQ())).filter(x => x.raspiID === raspiID );
          }

    }
}

export default resolvers