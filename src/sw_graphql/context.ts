import SwitchbotApi from '../sw_route_modules/switchbot_api'; 

interface Context {
    SwitchbotAPI: SwitchbotApi, 
    Token: string | undefined
}

export default Context