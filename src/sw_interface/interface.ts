export interface IDBConfig extends Options {
    user: string,
    password: string,
    server: string,
    database: string,
    requestTimeout: number,
    connectionTimeout: number,
    pool: {
        max: number,
        min: number,
        idleTimeoutMillis: number
    }
}


export interface Options {
    options: {
        encrypt: boolean,
        trustServerCertificate: boolean
    }
}
export interface machineQR{
    machineQRScan: string,
    userQRScan: string
}
export interface MachineList extends MachineType,SwitchBot,Raspi {}

export interface MachineUserInfo extends MachineList{
    UInfo: WorkerInfo[]
}
export interface MachineType {
    machineID?: number,
    machineName?: string,
    machineModel?: string
}

export interface SwitchBot {
    switchbotID?: number,
    switchbotName?: string,
    switchbotMac?: string,
    switchbotRaspiID?: number,
    RaspiList?: Raspi[]
}

export interface Raspi {
    raspiID?: number,
    raspiName?: string,
    raspiServer?: string
}

export interface WorkerToken  {
    ScanInfo: MachineUserInfo| null,
    Noket: string | null, 
}

export interface ErrorMsg { 
    message: string | [] 
}

export interface MachineArg {
    id: number,
    raspiID: number,
    raspiName: string,
    raspiServer: string
}
export interface MachineFilter{
    filter: {
        machineID: number
    }
}

export interface QRCode{
    machineQRScan: string,
    userQRScan: string 
}

export interface WorkerInfo{
    ID: number,
    FullName: string,
    AccLvl: number,
    UserQR: string,
    GIDFull: string
}

export interface WorkerInfoRegister extends WorkerInfo{
    Pass: string
}
export interface WorkerNoketInfo{
    uid: number,
    mID: number,
    rID: number,
    sID: number,
    acID: number
}
export interface QRInfo {
    QRInfo : string
} 

export interface MessageInfo {
    messages: EMessages[] | [],
    error: ErrorMsg[] | []
}
export interface EMessages {
    eventMSGID: number,
    eventMSG: string
} 
 
export interface EventParam {  
    msgID: number,
    mID?: number,
    sbid?: number,
    userid?: number 
}
export interface Machine {
    machineID?: number,
    machineName?: string,
    machineModel?: string,
    machineSwitchbotID?: number,
    machineQR?: string
}

export interface AccountType {
    acclvlID?: number,
    accType?: string
}
export interface SwitchbotFilter{
    filter: {
        switchbotID?: number,
        switchbotRaspiIDisNull?: boolean
    }
}
export interface SwitchbotDeleteParam{
    switchbotID: number
}
export interface ArgsInput {
    input: EventParam
}

export interface SwitchbotArgs {
    input: SwitchBot
}

export interface RaspiArgs {
    input: Raspi
}

export interface RaspiDeleteParam{
    raspiID: number
}

export interface MachineDeleteParam {
    machineID: number
}

export interface CreateMachineParam { 
    machineName?: string,
    machineModel?: string,
    machineQR?: string
}

export interface dupcheck {
    check: number
}
export interface RaspiDeleteArgs {
    input : RaspiDeleteParam
}
export interface RaspiCreateArgs {
    input: Raspi
}
export interface SwitchbotDeleteArgs{
    input: SwitchbotDeleteParam
}

export interface CreateMachineArgs {
    input: CreateMachineParam
}

export interface UpdateMachineArgs {
    input: Machine
}

export interface MachineDeleteArgs {
    input : MachineDeleteParam
}

export interface CreateAccountArgs {
    input: WorkerInfoRegister
}