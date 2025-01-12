import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";
import { createClient } from "@libsql/client";

export { schema };

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle(client, {
  schema,
});
