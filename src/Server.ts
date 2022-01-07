import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import logger from '@shared/Logger';
import switchbotRouter from './sw_routes/switchbot_routes';
import * as SwitchbotDB from './sw_route_modules/switchbot_api'; 
import * as UserDB from './sw_route_modules/user_api'
import typeDefs from './sw_graphql/schema';
import resolvers from './sw_graphql/resolvers';
import { ApolloServer } from 'apollo-server-express';
const app = express(); 
const router = express.Router();
const { BAD_REQUEST } = StatusCodes;

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: {
        SwitchbotDB,
        UserDB 
    }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}
app.set('etag', false);
app.set('json spaces', 2);
app.use("/api", switchbotRouter);
app.use('/', router);
app.disable('x-powered-by');
/*
app.use((err: Error, req: Request, res: Response) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});
router.get('*', (req: Request, res: Response) => {
    res.status(StatusCodes.NOT_FOUND).json(JSON.parse(`{"result":"Page not found! 404"}`));
});*/
async function startServer() { 
    await server.start();
    server.applyMiddleware({app: app, path: '/graphql'});
}
startServer();

export default app;
