import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

// Use different ports based on the environment
//const port = isProduction
//  ? 5432  // Default to 5432 for production
//  : 5434;  // Default to 5433 for development


const pool = new Pool({
  user: process.env.POSTGRES_USER_DEV,
  host: process.env.POSTGRES_HOST_DEV,
  database: process.env.POSTGRES_DB_DEV,
  password: process.env.POSTGRES_PASSWORD_DEV,
  // Local Host NEEDS VVVV 5434 VVVV Coded in...
  port: Number(process.env.PGPORT_DEV) || 5434,
  max: 20, // Increase max connections
  idleTimeoutMillis: 60000, // Keep idle connections for 60s
  connectionTimeoutMillis: 5000, // Wait 5s before timeout
  allowExitOnIdle: true, // Prevents app from hanging on shutdown
});

// const sql = postgres(process.env.DATABASE_URL, {
//   ssl: "require", // Ensure SSL is used
  
// });

pool.query('SELECT NOW()', (err, res) => {
	console.log(err || res.rows);
});


export default pool;
