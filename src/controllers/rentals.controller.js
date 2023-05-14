import  {db}  from "../database/database.connection.js"
import dayjs from 'dayjs'

export async function getAllRentals(req, res) {
    
    try {
        const rentals = await db.query(`
        SELECT 
                rentals.*,
                customers.id AS "customer.id",
                customers.name AS "customerName",
                games.id AS "gameId",
                games.name AS "gameName"
                FROM customers
            JOIN rentals ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId"
        `)
        const treatedRentals = rentals?.rows.map((rental) => {
            const {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, gameName, customerName } = rental
            return {
                id, customerId, gameId, rentDate: dayjs(rentDate).format('YYYY-MM-DD'),
                daysRented, returnDate: returnDate ? dayjs(returnDate).format('YYYY-MM-DD') : null,
                originalPrice, delayFee,
                customer: {id: customerId, name: customerName},
                game: {id: gameId, name: gameName}
            }
            })
        res.send(treatedRentals)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function postRental(req, res) {
    const {customerId, gameId, daysRented} = req.body
    try {
        //Existence validate
        const costumerExists = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
        if(!costumerExists.rowCount || !gameExists.rowCount ) return res.status(400).send('UserId ou GameId inválidos')
        //Quantity validate
        
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" is NULL`, [gameId])
        const stockTotal = gameExists.rows[0].stockTotal
        if(stockTotal <= rentals.rowCount) return res.status(400).send('Stock problems')
        
        
        const pricePerDay = gameExists.rows[0].pricePerDay
        const {rentDate, returnDate, originalPrice, delayFee} = {
            rentDate: dayjs().format("YYYY-MM-DD"),
            returnDate: null,
            originalPrice: daysRented * pricePerDay,
            delayFee: null
        }
        
        const rent = await db.query(`
        INSERT INTO rentals
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, 
        [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])
        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function endRental(req, res) {
    const {id} = req.params
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        const gameId = rental.rows[0].gameId
        const game = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
        if(rental.rowCount < 1) return res.sendStatus(404)
        if(rental.rows[0].returnDate !== null) return res.sendStatus(400)

        const returnDate = dayjs().format("YYYY-MM-DD")
        const daysDiff = dayjs(returnDate).diff(dayjs(rental.rows[0].rentDate), 'days')
        console.log(daysDiff)
        const pricePerDay = game.rows[0].pricePerDay
        
        const delayFee = daysDiff * pricePerDay
        await db.query(`
        UPDATE rentals
            SET "returnDate" = $2, "delayFee" = $3
            WHERE id=$1
        `, [id, returnDate, delayFee])
        res.sendStatus(200)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res) {
    const {id} = req.params
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        if(rental.rowCount < 1) return res.sendStatus(404)
        if(!rental.rows[0].returnDate) return res.sendStatus(400)
        await db.query(`
        DELETE * FROM rentals
        WHERE id=$1
        `, [id])
        res.sendStatus(200)
    } catch(err) {
        res.status(500).send(err.message)
    }
}