import rankingRepository from '../repositories/rankingRepository.js';

async function returnRankingUsers(){
    const rankingGeneral = await rankingRepository.getRanking();

    const objRanking: {
        fighters: any[]
    } = {
        fighters: rankingGeneral.rows
    }
    return objRanking;
}

const rankigService = {
    returnRankingUsers
}

export default rankigService;
