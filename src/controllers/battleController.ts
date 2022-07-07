import { Request, Response } from "express";

import battleService from "../services/battleService.js";

export async function createBattleBetweenUsers(req: Request, res: Response) {
    const {firstUser, secondUser}: {firstUser: string, secondUser: string} = req.body;
    console.log(firstUser, secondUser);

    const datailsFirstUser = await battleService.findUserInGitHubAPI(firstUser);
    const datailsSecondUser = await battleService.findUserInGitHubAPI(secondUser);
    console.log(datailsFirstUser, datailsSecondUser);

    const battle = await battleService.verifyBattleReposUser({
        repos_url: datailsFirstUser.repos_url,
        public_repos: datailsFirstUser.public_repos,
        login: datailsFirstUser.login
    }, {
        repos_url: datailsSecondUser.repos_url,
        public_repos: datailsSecondUser.public_repos,
        login: datailsSecondUser.login
    });
    console.log(battle);

    res.status(200).send(battle);
}
