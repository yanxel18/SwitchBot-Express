/* eslint-disable @typescript-eslint/no-unsafe-argument */ 
/* eslint-disable no-console */
import * as Models from '../sw_interface/interface'; 

interface SwitchbotDB {
    getMachineListQ:  () =>  Promise<Models.MachineList[]>,
    getRaspiQ: () => Promise<Models.Raspi[]>,
    getQRInfoQ: (qr: Models.machineQR) => Promise<string>
}
interface UserDB{
    generateToken: (machineQR: string, userQR: string) => Promise<string>
}
const resolvers = {
    Query: {
        MachineList: async function MachineList
        (parent: any, args: Models.MachineArg, {SwitchbotDB} :{SwitchbotDB: SwitchbotDB}): 
        Promise<Models.MachineList[]> {
            try {
               return  await SwitchbotDB.getMachineListQ();
            }catch (err: any){
                throw new Error(err)
            }
            
        },
        Machine: async function Machine(parent: any, args: Models.MachineArg, {SwitchbotDB} :
            {SwitchbotDB: SwitchbotDB}): 
            Promise<Models.MachineList | undefined> {
            const { id } = args; 
            return (( await SwitchbotDB.getMachineListQ()).find(x=> x.machineID === id))
        },
        MachineFilter: async function Machines(parent: any, args: Models.MachineFilter,
            {SwitchbotDB} :{SwitchbotDB: SwitchbotDB}):
            Promise<Models.MachineList[]>{
                const { machineID} = args.filter;
                const source = await SwitchbotDB.getMachineListQ(); 
                    if (machineID){  
                        return source.filter(x=> x.machineID === machineID)
                    } 
                    return source;
            }, 
        WorkerToken: async function generateToken(parent: any, args: Models.machineQR, 
            {SwitchbotDB} : {SwitchbotDB: SwitchbotDB}) : Promise<string>{    
            return  await SwitchbotDB.getQRInfoQ(args)
        }
    },
    Machine : {
        RaspiList:  async function RaspiList(parent: Models.MachineArg, args: any, {SwitchbotDB} :
            {SwitchbotDB: SwitchbotDB}) 
        : Promise<Models.Raspi[]>{
            const { raspiID} = parent;
            return ((await SwitchbotDB.getRaspiQ())).filter(x => x.raspiID === raspiID );
          }

    }
}

export default resolvers