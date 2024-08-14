import pkg from 'pg';
const { Pool } = pkg;
import { env } from './envConfig.js';

const pool = new Pool({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,
    ssl: env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, 
});

export const getDbClient = async () => {
    try {
        const client = await pool.connect();
        console.log("Successfully connected to Postgres");
        return client;
    } catch (err) {
        console.error('Error connecting to database: ', err.message);
    }
};
