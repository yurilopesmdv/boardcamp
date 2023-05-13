import { Router } from "express"
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer } from "../controllers/customers.controller.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"
import { customerSchema } from "../schemas/customer.schemas.js"

const customerRouter = Router()

customerRouter.get("/customers", getAllCustomers)
customerRouter.get("customers/:id", getCustomerById)
customerRouter.post("/customers", validateSchema(customerSchema), createCustomer)
customerRouter.put("/customers/:id", updateCustomer)

export default customerRouter