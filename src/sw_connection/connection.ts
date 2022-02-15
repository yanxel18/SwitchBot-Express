/* eslint-disable no-console */
import sql, { ConnectionPool } from 'mssql';
import { IDBConfig } from 'src/sw_interface/interface';

interface IDBConnection {
    openConnect: () => Promise<ConnectionPool>;
}

class DBConnection implements IDBConnection {
    protected DBConfig: IDBConfig = {
        user: process.env.MSSQL_USER || "",
        password: process.env.MSSQL_PASSWORD || "",
        server: process.env.MSSQL_SERVER || "",
        database: process.env.MSSQL_DATABASE || "",
        requestTimeout: 5000,
        connectionTimeout: 10000,
        pool: {
            max: 100,
            min: 0,
            idleTimeoutMillis: 10000
        },
        options: {
            encrypt: false,
            trustServerCertificate: false
        }
    }
    protected pool = new sql.ConnectionPool(this.DBConfig);

    public async openConnect(): Promise<ConnectionPool> {
        try{
            return await this.pool.connect();
        }catch(error: any){
            throw new Error("Cannot connect to database!")
        }
        
    }
}

export default DBConnection