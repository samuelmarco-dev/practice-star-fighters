import sqlstring from 'sqlstring';
import db from '../config/database.js'

async function getRanking() {
    const sql: string = sqlstring.format(`
        SELECT * FROM "fighters" ORDER BY "wins" DESC, "draws" DESC
    `, []);

    return db.query(sql);
}

const rankingRepository = {
    getRanking
}

export default rankingRepository;
