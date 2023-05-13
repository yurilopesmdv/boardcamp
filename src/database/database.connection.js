import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const configDatabase = {
    host: 'localhost',
    port: 5432,
    user: 'bootcamp_role',
    password: 'senha_super_hiper_ultra_secreta_do_role_do_bootcamp',
    database: 'boardcamp'
}

export const db = new Pool(configDatabase)
