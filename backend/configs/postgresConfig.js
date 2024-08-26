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

export const getPostgresDbClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    throw new Error('Failed to connect to the database');
  }
};

export const executeQuery = async (query, params = []) => {
  const client = await getPostgresDbClient();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    throw new Error(`Error executing query: ${error.message}`);
  } finally {
    client.release();
  }
};
