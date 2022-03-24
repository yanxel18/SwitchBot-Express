/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable no-console */
import cookieParser from 'cookie-parser';
//import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request } from 'express'; 
import 'express-async-errors'; 
import SwitchbotApi from './sw_route_modules/switchbot_api'; 
import ControlPanelApi from './sw_route_modules/controlpanel_api';
import UserApi from './sw_route_modules/user_api';
import typeDefs from './sw_graphql/schema';
import resolvers from './sw_graphql/resolvers';
import { ApolloServer } from 'apollo-server-express'; 
import RedisClient from './sw_util/redis';
import Context from './sw_graphql/context'; 
const redisclient = new RedisClient(); 
const app = express();
const router = express.Router();
const SwitchbotAPI = new SwitchbotApi(redisclient.client);
const ControlPanelAPI = new ControlPanelApi();
const UserAPI = new UserApi(redisclient.client) 
import { Router } from "express";
import axios from 'axios';

const testroute = Router();
testroute.get('/test', async function(req,res) {
    axios.defaults.baseURL = 'https://gorest.co.in'
   res.send(await axios.get("/public/v2/posts", 
   { proxy:{
       protocol: "https",
       host: "proxy-s01.yuden.co.jp",
       port: 8080,
       auth: {
           username: "jt0191340",
           password: "jt01913401"
       }
   }}).catch((error)=>{
       console.log(error)
   }));
});
const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    context: ({ req }: { req: Request }): Context => {
        const Token: string | undefined = req.header("Authorization")?.split(' ')[1]; 
        return {
            ControlPanelAPI,
            SwitchbotAPI,
            UserAPI,
            Token
        }
    },
    formatError: (err)=> { 
        return  new Error (err.message)
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(helmet());
}

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
app.set('etag', false);
app.set('json spaces', 2); 
app.use('/', router);
app.disable('x-powered-by');
 
async function startServer() {
    await server.start();
    server.applyMiddleware({ app: app, path: '/graphql' });
}
startServer();

export default app;
