import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

import battleRepository from "../repositories/battleRepository.js";

async function findUserInGitHubAPI(user: string){
    const url: string = process.env.API_GITHUB;
    const {data} = await axios.get(`${url}/${user}`);

    if(data.message){
        throw{
            type: "UserNotFound",
            message: "User not found"
        }
    }

    const {login, id, repos_url, name, public_repos} = data
    const objectUser: {
        login: string,
        id: number,
        repos_url: string,
        name: string,
        public_repos: number
    } = {
        login,
        id,
        repos_url,
        name,
        public_repos
    }

    return objectUser;
}

async function verifyBattleReposUser(
    objFirstUser: {repos_url: string, public_repos: number, login: string},
    objSecondUser: {repos_url: string, public_repos: number, login: string}
) {
    const {
        repos_url: urlFirstUser, public_repos: reposFirstUser, login: nameFirst
    } = objFirstUser;
    const {
        repos_url: urlSecondUser, public_repos: reposSecondUser, login: nameSecond
    } = objSecondUser;

    const {data: dataFirstUser} = await axios.get(urlFirstUser);
    const {data: dataSecondUser} = await axios.get(urlSecondUser);

    const numberStarFirstUser = returnNumberStargazersUser(dataFirstUser, reposFirstUser);
    const numberStarSecondUser = returnNumberStargazersUser(dataSecondUser, reposSecondUser);

    return await returnObjectBattleRequest(numberStarFirstUser, numberStarSecondUser, nameFirst, nameSecond);
}

function returnNumberStargazersUser(arr: any[], numberRepos: number){
    if(numberRepos === 0 || !arr || !arr.length) return 0;

    const numberStar: number[] = arr.map(item => {
        return item.stargazers_count;
    });

    return numberStar.reduce((total: number, number: number)=> {
        return total + number;
    }, 0);
}

async function returnObjectBattleRequest(starFirstUser: number, starSecondUser: number, nameFirst: string, nameSecond: string){
    if(starFirstUser > starSecondUser){
        await insertResultBattleInDatabase(nameFirst, 1, 0, 0);
        await insertResultBattleInDatabase(nameSecond, 0, 1, 0);

        const objBattle: {
            winner: string,
            loser: string,
            draws: boolean
        } = {
            "winner": nameFirst,
            "loser": nameSecond,
            "draws": false
        }
        return objBattle;
    }
    if(starFirstUser < starSecondUser){
        await insertResultBattleInDatabase(nameFirst, 0, 1, 0);
        await insertResultBattleInDatabase(nameSecond, 1, 0, 0);

        const objBattle: {
            winner: string,
            loser: string,
            draws: boolean
        } = {
            "winner": nameSecond,
            "loser": nameFirst,
            "draws": false
        }
        return objBattle;
    }
    await insertResultBattleInDatabase(nameFirst, 0, 0, 1);
    await insertResultBattleInDatabase(nameSecond, 0, 0, 1);

    const objBattle: {
        winner: null,
        loser: null,
        draws: boolean
    } = {
        "winner": null,
        "loser": null,
        "draws": true
    }
    return objBattle;
}

async function insertResultBattleInDatabase(name: string, win: number, lose: number, draws: number){
    const battleUser = await battleRepository.findBattleStargazers(name);
    const [user] = battleUser.rows;

    if(!user || battleUser.rowCount !== 1){
        await battleRepository.resultStargazersBattle(name, win, lose, draws);
        return;
    }
    await battleRepository.updateResultStargazersBattle(name, user.wins + win, user.losses + lose, user.draws + draws);
    return;
}

const battleService = {
    findUserInGitHubAPI,
    verifyBattleReposUser
}

export default battleService;
