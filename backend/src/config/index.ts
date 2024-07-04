require('dotenv').config();

interface databaseConfigInterface {
    user: string,
    password: string,
    host: string,
    port: number, 
    database: string,
}

interface authJwtInterface {
    secret: string,
}

export const databaseConfig: databaseConfigInterface = {
    user: String(process.env.USER),
    database: String(process.env.DATABASE),
    host: String(process.env.HOST),
    password: String(process.env.PASSWORD),
    port: parseInt(String(process.env.PORT))
}

export const authJwt:authJwtInterface = {
    secret: String(process.env.JWT_SECRET)
}

export const saltRoundPassword = parseInt(String(process.env.SALTS_ROUNDS_PASSWORD));