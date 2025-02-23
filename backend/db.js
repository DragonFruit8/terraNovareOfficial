import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.PORT,
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
