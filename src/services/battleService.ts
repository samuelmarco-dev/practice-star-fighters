import axios from "axios";
import dotenv from 'dotenv';
import battleRepository from "../repositories/battleRepository";
dotenv.config();

async function findUserInGitHubAPI(user: string){
    const url: string = process.env.API_GITHUB;
    const {data} = await axios.get(`${url}/${user}`);

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

    return returnObjectBattleRequest(numberStarFirstUser, numberStarSecondUser, nameFirst, nameSecond);
}

function returnNumberStargazersUser(arr: any[], numberRepos: number){
    if(numberRepos === 0 || !arr) return 0;

    const numberStar: number[] = arr.map(item => {
        return item.stargazers_count;
    });

    return numberStar.reduce((total: number, number: number)=> {
        return total + number;
    }, 0);
}

function returnObjectBattleRequest(starFirstUser: number, starSecondUser: number, nameFirst: string, nameSecond: string){
    if(starFirstUser > starSecondUser){
        return {
            "winner": nameFirst,
            "loser": nameSecond,
            "draws": false
        }
    }
    if(starFirstUser < starSecondUser){
        return {
            "winner": nameSecond,
            "loser": nameFirst,
            "draws": false
        }
    }
    return {
        "winner": null,
        "loser": null,
        "draws": true
    }
}

async function insertResultBattleInDatabase(nameFirst: string | null, nameSecond: string | null){
    const battleFirstUser: any = await battleRepository.findBattleStargazers(nameFirst);
    const [user] = battleFirstUser;
    if(!user || !battleFirstUser.rowCount){
        await battleRepository.updateResultStargazersBattle(nameFirst, 1, 0, 0);
    }

    const battleSecondUser = await battleRepository.findBattleStargazers(nameSecond);

    if(!nameFirst || !nameSecond) return;
}

const battleService = {
    findUserInGitHubAPI,
    verifyBattleReposUser
}

export default battleService;
