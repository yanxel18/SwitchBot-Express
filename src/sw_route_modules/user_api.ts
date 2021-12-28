/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import * as Models from '../sw_interface/interface';
import jwt from 'jsonwebtoken';




export async function generateToken(): Promise<string> {
    const saltPass = 10;
    
    const salt: string = bcrypt.genSaltSync(saltPass);
    //const c = await bcrypt.hash("testpassword", salt);
    const d = await bcrypt.hash("testpassword", salt)
 
    console.log(d);
    return d;
}