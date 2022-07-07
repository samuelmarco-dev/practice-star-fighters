import express, {json} from 'express';
import "express-async-errors";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import morgan from 'morgan';
import chalk from 'chalk';

import { handleError } from './middlewares/errorMiddleware';
import routesApp from './routers';

const app = express();
app.use(cors());
app.use(json());
app.use(morgan('dev'));
app.use(routesApp);
app.use(handleError);

const port: number = +process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(chalk.green(`Server is running on port ${port}`));
});
