import rankingRepository from '../repositories/rankingRepository.js';

async function returnRankingUsers(){
    const rankingGeneral = await rankingRepository.getRanking();
    console.log('rankingGeneral', rankingGeneral);

    return {
        "fighters": rankingGeneral.rows
    }
}

const rankigService = {
    returnRankingUsers
}

export default rankigService;
