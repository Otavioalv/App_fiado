import { release } from 'os';
import {Pool} from 'pg';

const connection = new Pool( {
    user: "postgres",
    password: "123456", 
    host: "127.0.0.1",
    port:  5432, 
    database: "appfiado",
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

