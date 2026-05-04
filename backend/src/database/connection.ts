import { release } from 'os';
import {Pool} from 'pg';
import { databaseConfig } from '../config';

// const connection = new Pool( {
//     user: databaseConfig.user,
//     password: databaseConfig.password, 
//     host: databaseConfig.host,
//     port:  databaseConfig.port, 
//     database: databaseConfig.database,
// })

const connection = new Pool({

    connectionString: databaseConfig.stringServer ? databaseConfig.stringServer : undefined,  
     
    // se nao tiver connectionString, conecta por outros dados
    user: databaseConfig.user,
    password: databaseConfig.password, 
    host: databaseConfig.host,
    port:  databaseConfig.port, 
    database: databaseConfig.database,

    ssl: {
        rejectUnauthorized: false
    }
});



connection.connect((err, client) => {
    if(err) {
        throw new Error(`Erro ao connectar ao banco de dados: ${err.message}`);
    } else {
        // console.log(`Conectado ao banco de dados com sucesso: https://127.0.0.1:5432`);
        console.log(`Conectado ao banco de dados com sucesso`);
        release();
    }
})

export default connection;



// import pkg from 'pg';

// const { Pool } = pkg;

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });


// pool.connect()
//     .then(client => {
//         console.log("Connected to the database");
//         client.release();
//     })
//     .catch(err => {
//         console.error("Failed to connect to the database", err);
//     });

    
// export default pool;