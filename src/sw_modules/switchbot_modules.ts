import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";
import sql, { IRecordSet } from 'mssql';
import bcrypt from 'bcrypt';

interface ISwitchBotAction {
    getMachineListForTrigger: () => Promise<Models.MachineList[]>,//for deletion
    getRaspi: () => Promise<Models.Raspi[]>,
    getQRInfo: (qr: Models.machineQR) => Promise<Models.MachineUserInfo | null>,
    generateToken: (qr: Models.machineQR) => Promise<string>,
    getMachineInfo: (qr: Models.machineQR) => Promise<Models.MachineList[]>,
    getEventMSGList: () => Promise<Models.EMessages[] | []>,
    getMachineLastEvent: (mID: number) => Promise<Models.LastEventParam[]|[]>,
    getWorkerInfo: (uid: number) => Promise<Models.WorkerInfo[]>,
    getEventMSG: () => Promise<Models.EMessages[] | []>,
    createEventLogs: (c: Models.EventParam) => Promise<IRecordSet<any>>
}
class SwitchBotAction extends DBConnection implements ISwitchBotAction {
    constructor() {
        super();
    } 
    public async getMachineListForTrigger(): Promise<Models.MachineList[]> {
        const con = await super.openConnect();
        const query = "select * from view_machine_select";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;
    }

    public async getRaspi(): Promise<Models.Raspi[]> {
        const con = await super.openConnect();
        const query = "select * from view_raspi_list order by raspiID desc";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;
    }

    public async getQRInfo(qr: Models.machineQR): Promise<Models.MachineUserInfo | null> {
        const con = await super.openConnect();
        const p: Models.QRInfo[] = (await con.request()
            .input('MachineQR', sql.NVarChar(100), qr.machineQRScan)
            .input('UserQR', sql.NVarChar(100), qr.userQRScan)
            .execute('sp_scan_qr')).recordset;
        if (p) {
            const e: Models.MachineUserInfo[] = JSON.parse(p[0].QRInfo);
            return e[0];
        } else return null;
    }

    public async generateToken(qr: Models.machineQR): Promise<string> {
        const { machineQRScan, userQRScan } = qr
        const saltPass = 10;
        const salt: string = bcrypt.genSaltSync(saltPass);
        return await bcrypt.hash(machineQRScan + userQRScan, salt);
    }

    public async getMachineInfo(qr: Models.machineQR): Promise<Models.MachineList[]> {
        const con = await super.openConnect();
        return await con.request()
            .input('MachineQR', sql.NVarChar(100), qr.machineQRScan)
            .execute('sp_qrmachine_info').then(
                result => { return result.recordset; }
            ) || null;
    }
    public async getWorkerInfo(uid: number): Promise<Models.WorkerInfo[]> {
        const con = await super.openConnect();
        return await con.request()
            .input('UserID', sql.SmallInt, uid)
            .execute('sp_qrworker_info').then(
                result => { return result.recordset; }
            ) || null;
    }

    public async getEventMSG(): Promise<Models.EMessages[] | []> {
        const con = await super.openConnect();
        const query = "select eventMSGID,eventMSG from view_event_msg";
        const r: Models.EMessages[] = await con.request().query(query).then(
            result => { return result.recordset; }
        );
        return r ? r : [];
    }

    public async getEventMSGList(): Promise<Models.EMessages[] | []> {
        const con = await super.openConnect();
        const query = "select eventMSGID,eventMSG from view_event_msg";
        const r: Models.EMessages[] = await con.request().query(query).then(
            result => { return result.recordset; }
        );
        return r ? r : [];
    }

    public async getMachineLastEvent(mID: number): Promise<Models.LastEventParam[]|[]> {
        const con = await super.openConnect();
        const query = `select  top 1 LogDate,EventType,MachineID,termEventMsg,termMsgID
        ,termID,termAction from view_last_event where MachineID=@mID order by LogDate desc`;
        return await con.request().input('mID',sql.Int, mID).query(query).then(
            result => { return result.recordset; }
        ) || []
 
    }

    public async createEventLogs(c: Models.EventParam): Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('mid', sql.SmallInt, c.mID)
            .input('msgid', sql.SmallInt, c.msgID)
            .input('sbid', sql.SmallInt, c.sbid)
            .input('userid', sql.SmallInt, c.userid)
            .input('logtypeid',sql.SmallInt, c.logtypeid)
            .execute('sp_create_eventlog').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }
}

export default SwitchBotAction