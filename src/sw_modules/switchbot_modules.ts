/* eslint-disable max-len */
/* eslint-disable no-console */
import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";
import sql from 'mssql';
import bcrypt from 'bcrypt'; 


 
interface ISwitchBotAction {
    getMachineList: () => Promise<Models.MachineList[]>,
    getRaspi: () => Promise<Models.Raspi[]>,
    getQRInfo: (qr: Models.machineQR) =>  Promise<Models.machineQR[]>,
    generateToken: (qr: Models.machineQR) => Promise<string> 
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

    public async getQRInfo(qr: Models.machineQR): Promise<Models.machineQR[]> {
        const con = await super.openConnect();
        return await con.request()
        .input('MachineQR', sql.NVarChar(100), qr.machineQRScan)
        .input('UserQR', sql.NVarChar(100), qr.userQRScan)
            .execute('sp_scan_qr').then(
                result => { return result.recordset}
            );
    }

    public async  generateToken(qr: Models.machineQR): Promise<string> {
        const { machineQRScan, userQRScan} = qr
        const saltPass = 10; 
        const salt: string = bcrypt.genSaltSync(saltPass); 
        return await bcrypt.hash( machineQRScan +  userQRScan, salt);
    }

}

export default SwitchBotAction