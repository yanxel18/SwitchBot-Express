/* eslint-disable @typescript-eslint/no-unsafe-argument */
 

/* eslint-disable no-console */
import * as Models from '../sw_interface/interface';

interface MachineArg {
    id: number
    raspiID: number
    raspiName: string
    raspiServer: string
}
interface MachineFilter{
    filter: {
        machineID: number
    }
}

interface MachineQR{
    machineQRScan: string
}
interface SwitchbotDB {
    getMachineListQ:  () =>  Promise<Models.MachineList[]>,
    getRaspiQ: () => Promise<Models.Raspi[]>,
    getMachineQR: (qr: string) => Promise<Models.machineQR[]>
}
interface UserDB{
    generateToken: () => Promise<string>
}
const resolvers = {
    Query: {
        MachineList: async function MachineList
        (parent: any, args: MachineArg, {SwitchbotDB} :{SwitchbotDB: SwitchbotDB}): 
        Promise<Models.MachineList[]> {
            try {
               return  await SwitchbotDB.getMachineListQ();
            }catch (err: any){
                throw new Error(err)
            }
            
        },
        Machine: async function Machine(parent: any, args: MachineArg, {SwitchbotDB} :
            {SwitchbotDB: SwitchbotDB}): 
            Promise<Models.MachineList | undefined> {
            const { id } = args; 
            return (( await SwitchbotDB.getMachineListQ()).find(x=> x.machineID === id))
        },
        MachineFilter: async function Machines(parent: any, args: MachineFilter,
            {SwitchbotDB} :{SwitchbotDB: SwitchbotDB}):
            Promise<Models.MachineList[]>{
                const { machineID} = args.filter;
                const source = await SwitchbotDB.getMachineListQ(); 
                    if (machineID){  
                        return source.filter(x=> x.machineID === machineID)
                    } 
                    return source;
            },
        WorkerToken: async function generateToken(parent: MachineArg, args: any, {UserDB} : 
            {UserDB: UserDB}) : Promise<string> {
                return await UserDB.generateToken();
        },
        isMachineQR: async function MachineQR(parent: any,  args: MachineQR , {SwitchbotDB} :
            {SwitchbotDB: SwitchbotDB}): Promise<boolean>{
            const { machineQRScan } = args;
            return  (await SwitchbotDB.getMachineQR(machineQRScan)).length > 0;
        }
    },
    Machine : {
        RaspiList:  async function RaspiList(parent: MachineArg, args: any, {SwitchbotDB} :
            {SwitchbotDB: SwitchbotDB}) 
        : Promise<Models.Raspi[]>{
            const { raspiID} = parent;
            return ((await SwitchbotDB.getRaspiQ())).filter(x => x.raspiID === raspiID );
          }

    }
}

export default resolvers