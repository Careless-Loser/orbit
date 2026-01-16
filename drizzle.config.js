import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./utils/schema.js",  // path to your schema
  out: "./drizzle/migrations",   // folder to store migrations
  dialect: "postgresql",         // required
  dbCredentials: {
    host: "ep-quiet-block-a8psduuf-pooler.eastus2.azure.neon.tech",
    port: 5432,
    user: "neondb_owner",
    password: "npg_TDYmvh0rk6fb",
    database: "neondb",
    ssl: { rejectUnauthorized: false },  // Neon requires SSL
  },
});
