import  {db} from "../database/database.connection.js"
import dayjs from "dayjs"

export async function getAllCustomers(req, res) {
    const {cpf: filter} = req.query
    try {
        if(filter) {
            const filteredCustomers = await db.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [`${filter}%`])
            const treatedCustomers = filteredCustomers?.rows.map((cust) => ({
                ... cust,
                birthday: dayjs(cust.birthday).format('YYYY-MM-DD')
            }))
            return res.status(200).send(treatedCustomers)
        }
        const customers = await db.query(`SELECT * FROM customers;`)
        const treatedCustomers = customers?.rows.map((cust) => ({
            ... cust,
            birthday: dayjs(cust.birthday).format('YYYY-MM-DD')
        }))
        res.status(200).send(treatedCustomers)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerById(req, res) {
    const {id} = req.params
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE customers.id=$1`, [id])
        if(customer.rowCount < 1) return res.sendStatus(404)
        const treatedCustomers = customer?.rows.map((cust) => ({
            ... cust,
            birthday: dayjs(cust.birthday).format('YYYY-MM-DD')
        }))
        return res.status(200).send(treatedCustomers[0])
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
        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}