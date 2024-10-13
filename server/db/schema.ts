import { relations, sql } from "drizzle-orm";
import * as sqlite from "drizzle-orm/sqlite-core";

export const users = sqlite.sqliteTable("users", {
  did: sqlite.text().primaryKey(),
  name: sqlite.text(),
  handle: sqlite.text().notNull(),
  avatarUrl: sqlite.text(),
  createdAt: sqlite.text().default(sql`(current_timestamp)`),
});

export const userSessions = sqlite.sqliteTable("user_sessions", {
  id: sqlite.int().primaryKey({ autoIncrement: true }),
  userId: sqlite
    .text()
    .notNull()
    .references(() => users.did),
  token: sqlite.text().notNull(),
  createdAt: sqlite.text().default(sql`(current_timestamp)`),
});

export const atprotoStates = sqlite.sqliteTable("atproto_states", {
  key: sqlite.text().primaryKey(),
  state: sqlite.text().notNull(),
  createdAt: sqlite
    .text()
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const atprotoSessions = sqlite.sqliteTable("atproto_sessions", {
  key: sqlite.text().primaryKey(),
  session: sqlite.text().notNull(),
  createdAt: sqlite
    .text()
    .notNull()
    .default(sql`(current_timestamp)`),
});
