import { Router } from "express"
import { getAllGames, postGame } from "../controllers/games.controller.js"

const gamesRouter = Router()

gamesRouter.get("/games", getAllGames)
gamesRouter.post("/games", postGame)

export default gamesRouter