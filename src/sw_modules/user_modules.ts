/* eslint-disable max-len */

import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";

interface ISwitchBotAction {
    getMachineList: () =>  Promise<Models.MachineList[]>;
    getRaspi: () => Promise<Models.Raspi[]>;
}

class SwitchBotAction extends DBConnection implements ISwitchBotAction {

    public async getMachineList(): Promise<Models.MachineList[]> {
        const con = await super.openConnect();
        const query = "select * from view_machine_select"; 
        return await con.request().query(query).then(
            result => { return result.recordset }
        )
    }

    public async getRaspi(): Promise<Models.Raspi[]> {
        const con = await super.openConnect();
        const query = "select * from view_raspi"; 
        return await con.request().query(query).then(
            result => { return result.recordset }
        )
    }
}

export default SwitchBotAction