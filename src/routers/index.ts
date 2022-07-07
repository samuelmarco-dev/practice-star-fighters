import { Router } from 'express';

import battleRouter from './battleRouter';
import rankingRouter from './rankingRouter';

const routesApp: Router = Router();

routesApp.use(battleRouter);
routesApp.use(rankingRouter);

export default routesApp;
