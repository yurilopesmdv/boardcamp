import { Router } from "express"
import { deleteRental, endRental, getAllRentals, postRental } from "../controllers/rentals.controller.js"
import validateSchema from "../middlewares/validateSchema.middleware.js"
import { rentalSchema } from "../schemas/rent.schema.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getAllRentals)
rentalsRouter.post("/rentals",validateSchema(rentalSchema), postRental)
rentalsRouter.post("/rentals/:id/return", endRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter