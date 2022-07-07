import { Router } from 'express';

import battleRouter from './battleRouter.js';
import rankingRouter from './rankingRouter.js';

const routesApp: Router = Router();

routesApp.use(battleRouter);
routesApp.use(rankingRouter);

export default routesApp;
