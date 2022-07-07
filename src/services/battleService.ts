import axios from "axios";
import dotenv from 'dotenv';
import battleRepository from "../repositories/battleRepository.js";
dotenv.config();

async function findUserInGitHubAPI(user: string){
    const url: string = process.env.API_GITHUB;
    const {data} = await axios.get(`${url}/${user}`);
    console.log('data', data);

    if(data.message === "Not Found"){
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
    console.log('numberStarFirstUser', numberStarFirstUser);
    console.log('numberStarSecondUser', numberStarSecondUser);

    return await returnObjectBattleRequest(numberStarFirstUser, numberStarSecondUser, nameFirst, nameSecond);
}

function returnNumberStargazersUser(arr: any[], numberRepos: number){
    if(numberRepos === 0 || !arr) return 0;

    const numberStar: number[] = arr.map(item => {
        return item.stargazers_count;
    });
    console.log('numberStar', numberStar);

    return numberStar.reduce((total: number, number: number)=> {
        return total + number;
    }, 0);
}

async function returnObjectBattleRequest(starFirstUser: number, starSecondUser: number, nameFirst: string, nameSecond: string){
    if(starFirstUser > starSecondUser){
        await insertResultBattleInDatabase(nameFirst, 1, 0, 0);
        await insertResultBattleInDatabase(nameSecond, 0, 1, 0);
        return {
            "winner": nameFirst,
            "loser": nameSecond,
            "draws": false
        }
    }
    if(starFirstUser < starSecondUser){
        await insertResultBattleInDatabase(nameFirst, 0, 1, 0);
        await insertResultBattleInDatabase(nameSecond, 1, 0, 0);
        return {
            "winner": nameSecond,
            "loser": nameFirst,
            "draws": false
        }
    }
    await insertResultBattleInDatabase(nameFirst, 0, 0, 1);
    await insertResultBattleInDatabase(nameSecond, 0, 0, 1);
    return {
        "winner": null,
        "loser": null,
        "draws": true
    }
}

async function insertResultBattleInDatabase(name: string, win: number, lose: number, draws: number){
    const battleUser: any = await battleRepository.findBattleStargazers(name);
    const [user] = battleUser.rows;
    console.log('battleUser', battleUser);
    console.log('user', user);

    if(!user || !battleUser.rowCount){
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
