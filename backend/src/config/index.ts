require('dotenv').config();

interface databaseConfigInterface {
    user: string,
    password: string,
    host: string,
    port: number, 
    database: string,
    stringServer: string
}

interface authJwtInterface {
    secret: string,
}

interface apiConfigInterface {
    host: string;
    port: number
}

export const databaseConfig: databaseConfigInterface = {
    user: String(process.env.PSQL_USER),
    database: String(process.env.PSQL_DATABASE),
    host: String(process.env.PSQL_HOST),
    password: String(process.env.PSQL_PASSWORD),
    port: parseInt(String(process.env.PSQL_PORT)),
    stringServer: String(process.env.PSQL_SERVER_STRING)
}

export const apiConfig: apiConfigInterface = {
    host: String(process.env.API_HOST),
    port: parseInt(String(process.env.API_PORT))
}


export const authJwt:authJwtInterface = {
    secret: String(process.env.JWT_SECRET)
}

export const saltRoundPassword = parseInt(String(process.env.SALTS_ROUNDS_PASSWORD));

