/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import * as Models from '../sw_interface/interface';
import jwt from 'jsonwebtoken';
 
export async function generateToken(machineQR: string, userQR: string): Promise<string> {
    const saltPass = 10; 
    const salt: string = bcrypt.genSaltSync(saltPass); 
    return await bcrypt.hash(machineQR + userQR, salt);
}