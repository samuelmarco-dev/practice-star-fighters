import sqlstring from 'sqlstring';
import db from '../config/database.js';

async function findBattleStargazers(username: string) {
    const sql: string = sqlstring.format(`
        SELECT * FROM "fighters" WHERE "username" = ?
    `, [username]);

    return db.query(sql);
}

async function resultStargazersBattle(username: string, wins: number, loses: number, draws: number) {
    const sql: string = sqlstring.format(`
        INSERT INTO "fighters" ("username", "wins", "losses", "draws")
        VALUES (?, ?, ?, ?)
    `, [username, wins, loses, draws]);

    return db.query(sql);
}

async function updateResultStargazersBattle(username: string, wins: number, loses: number, draws: number){
    const sql: string = sqlstring.format(`
        UPDATE "fighters" SET "wins" = ?, "losses" = ?, "draws" = ? WHERE "username" = ?
    `, [wins, loses, draws, username]);

    return db.query(sql);
}

const battleRepository = {
    resultStargazersBattle,
    findBattleStargazers,
    updateResultStargazersBattle
}

export default battleRepository;
