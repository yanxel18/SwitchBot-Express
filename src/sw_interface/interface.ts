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
export interface MachineList extends MachineType,Switchbot,Raspi {}

export interface MachineUserInfo extends MachineList{
    UInfo: WorkerInfo[]
}
export interface MachineType {
    machineID: number,
    machineName: string,
    machineModel: string
}

export interface Switchbot {
    switchbotID: number,
    switchbotName: string,
    switchbotMac: string
}

export interface Raspi {
    raspiID: number,
    raspiName: string,
    raspiServer: string
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

export interface ArgsInput {
    input: EventParam
}