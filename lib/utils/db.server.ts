import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Config } from "sst/node/config";

neonConfig.fetchConnectionCache = true;

const sql = neon(Config.DATABASE_URL);
export const db = drizzle(sql);
