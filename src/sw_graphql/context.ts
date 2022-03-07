import SwitchbotApi from '../sw_route_modules/switchbot_api';  
import ControlPanelApi from '../sw_route_modules/controlpanel_api';
import UserApi from '../sw_route_modules/user_api';
interface Context {
    SwitchbotAPI: SwitchbotApi, 
    ControlPanelAPI: ControlPanelApi,
    UserAPI: UserApi,
    Token: string | undefined
}

export default Context