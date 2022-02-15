/* eslint-disable no-console */
import ControlPanelAction from '../sw_modules/controlpanel_modules';
import * as Models from '../sw_interface/interface';

interface IControlPanelApi {
    createSwitchBotQ: (e: Models.SwitchBot, t: Models.WorkerNoketInfo) => Promise<string | null>
}

class ControlPanelApi extends ControlPanelAction implements IControlPanelApi {

    constructor() {
        super();
    }

    public async createSwitchBotQ(e: Models.SwitchBot, t:
        Models.WorkerNoketInfo): Promise<string | null> {
        try {
            await super.createSwitchbot(e, t);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot create switchbot!");
        }
    }

    public async getSwitchbotListQ(): Promise<Models.SwitchBot[] | null> {
        try {
            const b: Models.SwitchBot[] | null = await super.getSwitchbotList();
            return b || null
        } catch (error: any) {
            throw new Error("Cannot create switchbot!");
        }
    }

    public async deleteSwitchbotQ(e: Models.SwitchbotDeleteParam, t:
        Models.WorkerNoketInfo): Promise<string | null> {
        try {
            await super.deleteSwitchBot(e, t);
            return "success"
        } catch (error: any) {
            throw new Error("Cannot delete switchbot!");
        }
    }
}

export default ControlPanelApi