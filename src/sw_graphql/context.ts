import SwitchbotApi from '../sw_route_modules/switchbot_api';  
import ControlPanelApi from '../sw_route_modules/controlpanel_api';
interface Context {
    SwitchbotAPI: SwitchbotApi, 
    ControlPanelAPI: ControlPanelApi,
    Token: string | undefined
}

export default Context