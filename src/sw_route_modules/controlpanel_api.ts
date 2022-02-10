
/* eslint-disable no-console */
import ControlPanelAction from '../sw_modules/controlpanel_modules';
import * as Models from '../sw_interface/interface';
import { RedisClientType } from 'redis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { accessTokenSecret } from './../sw_util/keys';
import { ValidationError } from 'apollo-server-express';
import axios from 'axios';

interface IControlPanelApi {
    createSwitchBotQ: (e: Models.Switchbot, t: Models.WorkerNoketInfo) => Promise<string | null>
}

class ControlPanelApi extends ControlPanelAction implements IControlPanelApi {

    constructor() {
        super();
    }

    public async createSwitchBotQ(e: Models.Switchbot, t:
        Models.WorkerNoketInfo): Promise<string | null> {
        try {
            const b: Models.dupcheck[] | null = await super.createSwitchbot(e, t);
            if (b) {
                if (b[0].check === 1) {
                    return "duplicate"
                }
            } return "success"
        } catch (error: any) {
            throw new Error("Cannot create switchbot!");
        }

    }

    public async getSwitchbotListQ(): Promise<Models.Switchbot[] | null> {
        try {
            const b: Models.Switchbot[] | null = await super.getSwitchbotList();
            console.log(b)
             return b || null
        } catch (error: any) {
            throw new Error("Cannot create switchbot!");
        }

    }
}

export default ControlPanelApi