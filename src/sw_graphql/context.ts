import { JwtPayload } from 'jsonwebtoken';
import * as Models from '../sw_interface/interface'; 
import SwitchbotApi from '../sw_route_modules/switchbot_api';
import RedisClient from '../sw_util/redis';

interface Context {
    SwitchbotAPI: SwitchbotApi,
    Tokenizer: string | JwtPayload | null | undefined
}

export default Context