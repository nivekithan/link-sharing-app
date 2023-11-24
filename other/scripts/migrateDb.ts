import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { Config } from "sst/node/config";

const migrationClient = postgres(Config.DATABASE_URL, { max: 1 });
migrate(drizzle(migrationClient), { migrationsFolder: "migrations" });
