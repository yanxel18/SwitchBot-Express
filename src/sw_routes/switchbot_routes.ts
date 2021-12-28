/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import * as SwitchBotAPI from "../sw_route_modules/switchbot_api";

const routes = Router();

//routes.get("/machinelist", SwitchBotAPI.getMachineList);

const switchbotRouter = Router();

switchbotRouter.use('/sw',routes);


export default switchbotRouter;