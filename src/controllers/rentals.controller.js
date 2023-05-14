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
    try {

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function endRental(req, res) {
    try {

    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res) {
    try {

    } catch(err) {
        res.status(500).send(err.message)
    }
}