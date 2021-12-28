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
    machineQR: string
}
export interface MachineList extends MachineType,Switchbot,Raspi {}
 
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

export interface Token {
    Token: string
}