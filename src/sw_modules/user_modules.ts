/* eslint-disable max-len */

import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";
import sql, { IProcedureResult, IRecordSet, IResult } from 'mssql';

interface IUserAction {
    createAccount: (userInfo: Models.WorkerInfoRegister, t: Models.WorkerNoketInfo, passCrypt: string) =>
        Promise<IRecordSet<any>>,
    getAccountType: () => Promise<Models.AccountType[]>
}
class UserAction extends DBConnection implements IUserAction {

    public async createAccount(userInfo: Models.WorkerInfoRegister,
        t: Models.WorkerNoketInfo, passCrypt: string):
        Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('FullName', sql.NVarChar(20), userInfo.FullName)
            .input('AccLvl', sql.TinyInt, userInfo.AccLvl)
            .input('UserQR', sql.NVarChar(100), userInfo.UserQR)
            .input('GIDFull', sql.NVarChar(20), userInfo.GIDFull)
            .input('PassCrypt', sql.NVarChar(150), passCrypt)
            .input('uid', sql.SmallInt, t.uid)
            .execute('sp_create_account').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async getAccountType(): Promise<Models.AccountType[]> {
        const con = await super.openConnect();
        const query = "select * from view_account_type";
        return await con.request().query(query).then(
            result => { return result.recordset; }
        ) || null;

    }
}

export default UserAction