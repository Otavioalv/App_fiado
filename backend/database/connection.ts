import {Pool} from 'pg';

const pool = new Pool( {
    user: "postgres",
    password: "123456", 
    host: "127.0.0.1",
    port:  5432, 
    database: "appfiado",
})

pool.connect((err, client) => {
    if(err) {
        throw new Error(`Erro ao connectar ao banco de dados: ${err.message}`);
    } else {
        console.log(`Conectado ao banco de dado consucesso: https://127.0.0.1:5432`);
    }
})

module.exports = pool;

