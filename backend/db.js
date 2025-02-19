import postgres from "postgres"; // Import from @neondatabase/serverless
import dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require", // Ensure SSL is used
  
});




export default sql;