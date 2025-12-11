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
    user: process.env.PSQL_USER || "",
    database: process.env.PSQL_DATABASE || "",
    host: process.env.PSQL_HOST || "0.0.0.0",
    password: process.env.PSQL_PASSWORD || "",
    port: Number(process.env.PSQL_PORT) || 5432,
    stringServer: process.env.DATABASE_URL || ""
}

export const apiConfig: apiConfigInterface = {
    host: process.env.API_HOST || "0.0.0.0",
    port: Number(process.env.PORT || process.env.API_PORT || 8090)
}


export const authJwt:authJwtInterface = {
    secret: String(process.env.JWT_SECRET)
}

export const saltRoundPassword = parseInt(String(process.env.SALTS_ROUNDS_PASSWORD));

