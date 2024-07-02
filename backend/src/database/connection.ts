import { release } from 'os';
import {Pool} from 'pg';
import { databaseConfig } from '../config';

const connection = new Pool( {
    user: databaseConfig.user,
    password: databaseConfig.password, 
    host: databaseConfig.host,
    port:  databaseConfig.port, 
    database: databaseConfig.database,
})

connection.connect((err, client) => {
    if(err) {
        throw new Error(`Erro ao connectar ao banco de dados: ${err.message}`);
    } else {
        console.log(`Conectado ao banco de dados com sucesso: https://127.0.0.1:5432`);
        release();
    }
})

export default connection;

