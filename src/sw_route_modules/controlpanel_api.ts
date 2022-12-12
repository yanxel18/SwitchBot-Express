/* eslint-disable no-console */
import ControlPanelAction from "../sw_modules/controlpanel_modules";
import * as Models from "../sw_interface/interface";
import { v4 as uuidv4 } from "uuid";
interface IControlPanelApi {
  createSwitchBotQ: (
    e: Models.SwitchBot,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  getSwitchbotListQ: () => Promise<Models.SwitchBot[] | null>;
  deleteSwitchbotQ: (
    e: Models.SwitchbotDeleteParam,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  updateSwitchbotQ: (
    e: Models.SwitchBot,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  updateRaspiQ: (
    e: Models.Raspi,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  createRaspiQ: (
    e: Models.Raspi,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  deleteRaspiQ: (
    e: Models.RaspiDeleteParam,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  createMachineQ: (
    e: Models.Machine,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  createTabletEventQ: (
    e: Models.createTabletEvent,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  getMachineListQ: () => Promise<Models.Machine[]>;
  getTerminalsQ: () => Promise<Models.Terminal[]>;
  updateMachineQ: (
    e: Models.Machine,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  deleteMachineQ: (
    e: Models.MachineDeleteParam,
    t: Models.WorkerNoketInfo
  ) => Promise<string | null>;
  getWorkerListQ: () => Promise<Models.WorkerInfo[]>;
}

class ControlPanelApi extends ControlPanelAction implements IControlPanelApi {
  constructor() {
    super();
  }

  public async createSwitchBotQ(
    e: Models.SwitchBot,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.createSwitchbot(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot create switchbot! " + error);
    }
  }

  public async getSwitchbotListQ(): Promise<Models.SwitchBot[] | null> {
    try {
      const b: Models.SwitchBot[] | null = await super.getSwitchbotList();
      return b || null;
    } catch (error: any) {
      throw new Error("Cannot create switchbot! " + error);
    }
  }

  public async deleteSwitchbotQ(
    e: Models.SwitchbotDeleteParam,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.deleteSwitchBot(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot delete switchbot! " + error);
    }
  }

  public async updateSwitchbotQ(
    e: Models.SwitchBot,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.updateSwitchbot(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot update switchbot! " + error);
    }
  }

  public async updateRaspiQ(
    e: Models.Raspi,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.updateRaspi(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot update Raspberry PI! " + error);
    }
  }
  public async createRaspiQ(
    e: Models.Raspi,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.createRaspi(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot create Rasperry Pi! " + error);
    }
  }
  public async deleteRaspiQ(
    e: Models.RaspiDeleteParam,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.deleteRaspi(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot delete Raspberry PI! " + error);
    }
  }

  public async createMachineQ(
    e: Models.Machine,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      e.machineQR = uuidv4();
      await super.createMachine(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot create Machine! " + error);
    }
  }

  public async createTabletEventQ(
    e: Models.createTabletEvent,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.deleteTabletEvent(e);
      await Promise.all(
        e.eventMSG.map(async (value) => {
          await super.createTabletEvent(value, e.terminalID, t);
        })
      );
      return "success";
    } catch (error: any) {
      throw new Error("Cannot create Tablet Events! " + error);
    }
  }
  public async getTerminalsQ(): Promise<Models.Terminal[]> {
    try {
      return await super.getTerminals();
    } catch (error: any) {
      throw new Error("Cannot load Terminal list! " + error);
    }
  }

  public async getTerminalEventsQ(lang: string): Promise<Models.TerminalEvents[]> {
    try {
      return await super.getTerminalEvents(lang);
    } catch (error: any) {
      throw new Error("Cannot load Terminal Events list! " + error);
    }
  }
  public async getMachineListQ(): Promise<Models.Machine[]> {
    try {
      return await super.getMachineList();
    } catch (error: any) {
      throw new Error("Cannot load Machine list! " + error);
    }
  }

  public async updateMachineQ(
    e: Models.Machine,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.updateMachine(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot update Machine! " + error);
    }
  }

  public async deleteMachineQ(
    e: Models.MachineDeleteParam,
    t: Models.WorkerNoketInfo
  ): Promise<string | null> {
    try {
      await super.deleteMachine(e, t);
      return "success";
    } catch (error: any) {
      throw new Error("Cannot delete Machine! " + error);
    }
  }

  public async getWorkerListQ(): Promise<Models.WorkerInfo[]> {
    return await super.getWorkerList();
  }
}

export default ControlPanelApi;
