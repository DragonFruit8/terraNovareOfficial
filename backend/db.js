import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: `terranovare_user`,
  host: `127.0.0.1`,
  database: `terranovare`,
  password: `TranceFlow3rcvp23@1`,
  port: 5432, // Default PostgreSQL port
});

// const sql = postgres(process.env.DATABASE_URL, {
//   ssl: "require", // Ensure SSL is used
  
// });

pool.query('SELECT NOW()', (err, res) => {
	console.log(err || res.rows);
});


export default pool;
