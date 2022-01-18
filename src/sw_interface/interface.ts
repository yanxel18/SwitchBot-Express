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
    Noket: string | null,
    error: [ErrorMsg] | []
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
    GIDFUll: string
}

export interface WorkerNoketInfo{
    id: number,
    mID: number,
    rID: number,
    acID: number
}
export interface QRInfo {
    QRInfo : string
} 