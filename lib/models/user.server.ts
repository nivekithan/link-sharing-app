import { pgTable, text } from "drizzle-orm/pg-core";
import crypto from "node:crypto";

export const userTable = pgTable("user", {
  id: text("id")
    .notNull()
    .$default(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});
