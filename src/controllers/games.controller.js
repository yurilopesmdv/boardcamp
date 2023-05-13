import {db} from "../database/database.connection.js";

export async function getAllGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`)
        
        res.status(200).send(games.rows)
    } catch(err) {
        res.status(500).send(err.message)
    }
}
export async function postGame(req, res) {
    const {name, image, stockTotal, pricePerDay} = req.body
    try {
        const gameExists = await db.query(`SELECT * FROM games WHERE name=$1;`, [name])
        console.log(gameExists.rows)
        if(gameExists.rowCount > 0) return res.sendStatus(409)
        await db.query(
            `INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`
            , [name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err.message)
    }
}