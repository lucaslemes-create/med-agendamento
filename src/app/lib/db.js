import { neon } from "@neondatabase/serverless";

// Conexão com o banco Neon PostgreSQL
// A variável DATABASE_URL está no arquivo .env.local
const sql = neon(process.env.DATABASE_URL);

export default sql;