import { type Config } from "drizzle-kit";

export default {
  schema: "./lib/models/**",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  out: "migrations",
} satisfies Config;
