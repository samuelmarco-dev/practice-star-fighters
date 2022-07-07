import { Request, Response } from "express";

import battleService from "../services/battleService.js";

export async function createBattleBetweenUsers(req: Request, res: Response) {
    const {firstUser, secondUser}: {firstUser: string, secondUser: string} = req.body;
    if(!firstUser || !secondUser) return res.sendStatus(422);

    const datailsFirstUser = await battleService.findUserInGitHubAPI(firstUser);
    const datailsSecondUser = await battleService.findUserInGitHubAPI(secondUser);

    const battle = await battleService.verifyBattleReposUser({
        repos_url: datailsFirstUser.repos_url,
        public_repos: datailsFirstUser.public_repos,
        login: datailsFirstUser.login
    }, {
        repos_url: datailsSecondUser.repos_url,
        public_repos: datailsSecondUser.public_repos,
        login: datailsSecondUser.login
    });
    res.status(200).send(battle);
}
