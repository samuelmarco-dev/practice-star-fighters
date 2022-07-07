import { Request, Response } from "express";

import rankigService from "../services/rankingService.js";

export async function getRankingUserOrderByWinsAndDraws(req: Request, res: Response){
    const ranking = await rankigService.returnRankingUsers();

    res.status(200).send(ranking);
}
