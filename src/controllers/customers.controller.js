import  {db} from "../database/database.connection.js"

export async function getAllCustomers(req, res) {
    const {cpf: filter} = req.query
    try {
        if(filter) {
            const filteredCustomers = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${filter}%`])
            
            return res.status(200).send(filteredCustomers.rows)
        }
        const customers = await db.query(`SELECT * FROM customers;`)
        res.status(200).send(customers.rows)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerById(req, res) {
    const {id} = req.params
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE customers.id=$1`, [id])
        if(customer.rowCount < 1) return res.sendStatus(404)
        res.status(200).send(customer.rows[0])
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function createCustomer(req, res) {
    const {name, phone, cpf, birthday} = req.body
    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
        if(customerExists.rowCount > 0) return res.sendStatus(409)
        await db.query(`
        INSERT INTO customers
            (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])

        res.sendStatus(201)
    } catch(err) {
        res.status(500).send(err.message)
    }
}
export async function updateCustomer(req, res) {
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body
    try {
        const otherCustomer = await db.query(`SELECT * FROM customers WHERE cpf=$1 AND id <> $2`, [cpf, id])
        if(otherCustomer.rowCount > 0) return res.sendStatus(409)
        await db.query(`
        UPDATE customers
            SET name = $1, phone = $2, cpf = $3, birthday = $4
            WHERE id = $5
            `, [name, phone, cpf, birthday, id])
    } catch (err) {
        res.status(500).send(err.message)
    }
}