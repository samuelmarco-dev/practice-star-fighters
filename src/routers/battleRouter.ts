import { Router } from "express"
import { createBattleBetweenUsers } from "../controllers/battleController.js";

const battleRouter: Router = Router();

battleRouter.post('/battle', createBattleBetweenUsers);

export default battleRouter;
