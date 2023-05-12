import { Router } from "express"
import { deleteRental, endRental, getAllRentals, postRental } from "../controllers/rentals.controller.js"

const rentalsRouter = Router()

rentalsRouter.get("/rentals", getAllRentals)
rentalsRouter.post("/rentals", postRental)
rentalsRouter.post("/rentals/:id/return", endRental)
rentalsRouter.delete("/rentals/:id", deleteRental)

export default rentalsRouter