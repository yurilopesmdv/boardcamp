import { Router } from "express"
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customers.controller.js"

const customerRouter = Router()

customerRouter.get("/customers", getAllCustomers)
customerRouter.get("customers/:id", getCustomerById)
customerRouter.post("/customers", createCustomer)
customerRouter.put("/customers/:id", updateCustomer)

export default customerRouter