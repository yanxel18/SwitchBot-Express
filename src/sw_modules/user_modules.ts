import DBConnection from "../sw_connection/connection";
import * as Models from "../sw_interface/interface";
import sql, { IRecordSet } from 'mssql';

interface IUserAction {
    createAccount: (userInfo: Models.WorkerInfo, t: Models.WorkerNoketInfo, passCrypt: string) =>
        Promise<IRecordSet<any>>,
    getAccountType: () => Promise<Models.AccountType[]>,
    updateAccount: (userInfo: Models.WorkerInfo, t: Models.WorkerNoketInfo) =>
        Promise<IRecordSet<any>>,
    updatePassword: (userInfo: Models.WorkerInfo,
        t: Models.WorkerNoketInfo, passCrypt: string) => Promise<IRecordSet<any>>,
    authenticateAccount: (info: Models.LoginInfo) => Promise<Models.UserLoginInfo | null>
}

class UserAction extends DBConnection implements IUserAction {

    public async createAccount(userInfo: Models.WorkerInfo,
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

    public async updateAccount(userInfo: Models.WorkerInfo, t: Models.WorkerNoketInfo):
        Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('ID', sql.TinyInt, userInfo.ID)
            .input('FullName', sql.NVarChar(20), userInfo.FullName)
            .input('AccLvl', sql.TinyInt, userInfo.AccLvl)
            .input('uid', sql.SmallInt, t.uid)
            .execute('sp_update_account').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async updatePassword(userInfo: Models.WorkerInfo,
        t: Models.WorkerNoketInfo, passCrypt: string):
        Promise<IRecordSet<any>> {
        const con = await super.openConnect();
        return await con.request()
            .input('ID', sql.TinyInt, userInfo.ID)
            .input('PassCrypt', sql.NVarChar(150), passCrypt)
            .input('uid', sql.SmallInt, t.uid)
            .execute('sp_update_account_password').then(
                result => {
                    return result.recordset
                }
            ) || null;
    }

    public async authenticateAccount(info: Models.LoginInfo): Promise<Models.UserLoginInfo | null> {
        const con = await super.openConnect();
        const getInfo: Models.UserLoginInfo[] | null = (await con.request()
            .input('GIDFull', sql.NVarChar(20), info.GIDFull)
            .execute('sp_login').then(
                result => {
                    return result.recordset
                }
            ) || null);
        if (getInfo) return getInfo[0];
        else return null;
    }
}

export default UserAction