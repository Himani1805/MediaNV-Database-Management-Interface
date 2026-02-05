import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

// Create a new pool instance using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Event listener for successful connection
pool.on('connect', () => {
  console.log('PostgreSQL Connection Pool established successfully');
});

// Event listener for unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Export the pool to be used in controllers/routes
export default pool;