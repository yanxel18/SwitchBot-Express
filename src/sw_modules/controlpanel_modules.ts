/* eslint-disable max-len */
/* eslint-disable no-console */
import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface"; 
import sql, { IProcedureResult, IRecordSet, IResult } from 'mssql';
interface IControlPanelAction {
    createSwitchbot: (c: Models.Switchbot, t: Models.WorkerNoketInfo) => Promise<Models.dupcheck[] | null>
}
class ControlPanelAction extends DBConnection implements IControlPanelAction {
    constructor(){
        super();
    }

    public async createSwitchbot(c: Models.Switchbot, t: Models.WorkerNoketInfo): Promise<Models.dupcheck[]| null>{
        const con = await super.openConnect();
        return await con.request()
                .input('switchbotName', sql.NVarChar(50), c.switchbotName)
                .input('switchbotMac', sql.NVarChar(20), c.switchbotMac) 
                .input('uid', sql.SmallInt,t.uid)
                .execute('sp_create_switchbot').then(
                    result => {
                        return result.recordset
                    }
                ) || null;
    }

    public async getSwitchbotList(): Promise<Models.Switchbot[]> {
        const con = await super.openConnect();
        const query = "select * from view_switchbot order by switchbotID desc";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;
    }
}

export default ControlPanelAction