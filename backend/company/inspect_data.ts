import { api } from "encore.dev/api";
import { companyDB } from "./db";

export interface TableData {
  tableName: string;
  data: any[];
  count: number;
}

export interface InspectDataParams {
  table?: string;
  limit?: number;
}

export interface InspectDataResponse {
  tables: TableData[];
}

// Inspects database tables and their data for development purposes.
export const inspectData = api<InspectDataParams, InspectDataResponse>(
  { expose: true, method: "GET", path: "/inspect-data" },
  async (params) => {
    const limit = params.limit || 10;
    const tables: TableData[] = [];

    // Get all table names if no specific table requested
    const tableNames = params.table 
      ? [params.table]
      : await companyDB.queryAll<{ table_name: string }>`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `.then(rows => rows.map(r => r.table_name));

    for (const tableName of tableNames) {
      try {
        // Get row count
        const countResult = await companyDB.queryRow<{ count: number }>`
          SELECT COUNT(*) as count FROM ${tableName}
        `;
        const count = countResult?.count || 0;

        // Get sample data
        const data = await companyDB.rawQueryAll(
          `SELECT * FROM ${tableName} ORDER BY id LIMIT $1`,
          limit
        );

        tables.push({
          tableName,
          data,
          count
        });
      } catch (error) {
        // Skip tables that can't be queried
        console.error(`Error querying table ${tableName}:`, error);
      }
    }

    return { tables };
  }
);
