import { json, pgTable, text } from "drizzle-orm/pg-core";
import { type PlatformValue } from "~/components/inputs";
import crypto from "node:crypto";

export const userTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$default(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
});

export type ListOfLinks = { platform: PlatformValue; link: string }[];
export const linksTable = pgTable("links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
  listOfLinks: json("list_of_links").notNull().$type<ListOfLinks>(),
});

export const profileTable = pgTable("profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id),
  pictureUrl: text("picture_url").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
});
