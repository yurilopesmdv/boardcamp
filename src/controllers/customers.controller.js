import  {db} from "../database/database.connection.js"

export async function getAllCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        res.status(200).send(customers.rows)
    } catch(err) {
        res.status(500).send(err.message)
    }
}

export async function getCustomerById(req, res) {

}

export async function createCustomer(req, res) {

}
export async function updateCustomer(req, res) {
    
}