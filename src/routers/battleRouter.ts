import { Router } from "express"

import { createBattleBetweenUsers } from "../controllers/battleController.js";
import { schemasValidation } from "../middlewares/schemaMiddleware.js";
import schemaBattle from "../utils/schemaBattle.js";

const battleRouter: Router = Router();

battleRouter.post('/battle', schemasValidation(schemaBattle), createBattleBetweenUsers);

export default battleRouter;
