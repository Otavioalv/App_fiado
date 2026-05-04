import pkg from 'pg';
import { databaseConfig } from '../index';


const { Pool } = pkg;

const pool = new Pool({
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


pool.connect()
    .then(client => {
        console.log("Connected to the database");
        client.release();
    })
    .catch(err => {
        console.error("Failed to connect to the database", err);
    });

    
export default pool;


