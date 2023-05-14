import Joi from "joi"

export const rentalSchema = Joi.object({
    customerId: Joi.number().positive().required(),
    gameId: Joi.number().positive().required(),
    daysRented: Joi.number().positive().required()
})