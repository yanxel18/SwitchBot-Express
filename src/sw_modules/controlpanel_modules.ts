/* eslint-disable max-len */
/* eslint-disable no-console */
import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";
import sql, { IProcedureResult, IRecordSet, IResult } from 'mssql';

interface IControlPanelAction {
    createSwitchbot: (c: Models.SwitchBot, t: Models.WorkerNoketInfo) => Promise<Models.dupcheck[] | null>,
    getSwitchbotList:() => Promise<Models.SwitchBot[]>,
    deleteSwitchBot: (p: Models.SwitchbotDeleteParam, t: Models.WorkerNoketInfo) => Promise<IRecordSet<any>>,
    updateSwitchbot: (p: Models.SwitchBot, t: Models.WorkerNoketInfo) => Promise<IRecordSet<any>>,
    updateRaspi: (p: Models.Raspi, t: Models.WorkerNoketInfo) => Promise<IRecordSet<any>>,
    createRaspi: (c: Models.Raspi, t: Models.WorkerNoketInfo)=> Promise<Models.dupcheck[] | null>,
    deleteRaspi: (p: Models.RaspiDeleteParam, t: Models.WorkerNoketInfo) => Promise<IRecordSet<any>>,
    createMachine: (c: Models.Machine, t: Models.WorkerNoketInfo, qr: string) => Promise<Models.dupcheck[] | null>,
    getMachineList: () => Promise<Models.Machine[]>,
    updateMachine: (p: Models.Machine, t: Models.WorkerNoketInfo) => Promise<IRecordSet<any>>

}
class ControlPanelAction extends DBConnection implements IControlPanelAction {
    constructor() {
        super();
    }

    public async createSwitchbot(c: Models.SwitchBot, t: Models.WorkerNoketInfo): Promise<Models.dupcheck[] | null> {
        const con = await super.openConnect();
        return await con.request()
            .input('switchbotName', sql.NVarChar(50), c.switchbotName)
            .input('switchbotMac', sql.NVarChar(20), c.switchbotMac)
            .input('uid', sql.SmallInt, t.uid)
            .execute('sp_create_switchbot').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async getSwitchbotList(): Promise<Models.SwitchBot[]> {
        const con = await super.openConnect();
        const query = "select * from view_switchbot_list order by switchbotID desc";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;
    }

    public async deleteSwitchBot(p: Models.SwitchbotDeleteParam, t: Models.WorkerNoketInfo): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('switchbotID', sql.SmallInt, p.switchbotID) 
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_delete_switchbot').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }
    public async updateSwitchbot(p: Models.SwitchBot, t: Models.WorkerNoketInfo): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('switchbotID', sql.SmallInt, p.switchbotID) 
            .input('switchbotName', sql.NVarChar(50), p.switchbotName) 
            .input('switchbotMac', sql.NVarChar(20), p.switchbotMac)
            .input('switchbotRaspiID', sql.SmallInt, p.switchbotRaspiID) 
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_update_switchbot').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async updateRaspi(p: Models.Raspi, t: Models.WorkerNoketInfo): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('raspiID', sql.SmallInt, p.raspiID) 
            .input('raspiName', sql.NVarChar(50), p.raspiName) 
            .input('raspiServer', sql.NVarChar(300), p.raspiServer) 
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_update_raspi').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }
    public async createRaspi(c: Models.Raspi, t: Models.WorkerNoketInfo): Promise<Models.dupcheck[] | null> {
        const con = await super.openConnect();
        return await con.request()
            .input('raspiName', sql.NVarChar(50), c.raspiName)
            .input('raspiServer', sql.NVarChar(300), c.raspiServer)
            .input('uid', sql.SmallInt, t.uid)
            .execute('sp_create_raspi').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }
    public async deleteRaspi(p: Models.RaspiDeleteParam, t: Models.WorkerNoketInfo): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('raspiID', sql.SmallInt, p.raspiID) 
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_delete_raspi').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async createMachine(c: Models.Machine, t: Models.WorkerNoketInfo): 
        Promise<Models.dupcheck[] | null> {
        const con = await super.openConnect();
        return await con.request()
            .input('machineName', sql.NVarChar(50), c.machineName)
            .input('machineModel', sql.NVarChar(50), c.machineModel)
            .input('machineQR', sql.NVarChar(100), c.machineQR)
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_create_machine').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async getMachineList(): Promise<Models.Machine[]> {
        const con = await super.openConnect();
        const query = "select * from view_machine_list order by machineID desc";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;
    }

    public async updateMachine(p: Models.Machine, t: Models.WorkerNoketInfo): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('machineID', sql.SmallInt, p.machineID) 
            .input('machineName', sql.NVarChar(50), p.machineName) 
            .input('machineModel', sql.NVarChar(50), p.machineModel)
            .input('machineSwitchbotID', sql.SmallInt, p.machineSwitchbotID) 
            .input('userID', sql.SmallInt, t.uid)
            .execute('sp_update_machine').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }
}

export default ControlPanelAction