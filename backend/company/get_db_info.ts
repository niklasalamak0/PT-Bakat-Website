import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface DatabaseInfo {
  connectionString: string;
  tables: string[];
}

// Gets database connection information for development purposes.
export const getDatabaseInfo = api<void, DatabaseInfo>(
  { expose: true, method: "GET", path: "/db-info" },
  async () => {
    // Get table names
    const tables = await companyDB.queryAll<{ table_name: string }>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    return {
      connectionString: companyDB.connectionString,
      tables: tables.map(t => t.table_name)
    };
  }
);
