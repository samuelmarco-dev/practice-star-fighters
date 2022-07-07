import { Router } from "express"

import { getRankingUserOrderByWinsAndDraws } from "../controllers/rankingController.js";

const rankingRouter: Router = Router();

rankingRouter.get('/ranking', getRankingUserOrderByWinsAndDraws);

export default rankingRouter;
