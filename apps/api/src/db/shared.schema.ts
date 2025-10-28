import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "./utils";

export const attachment = sqliteTable("attachment", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => nanoid()),
	relationId: text("relation_id").notNull(),
	url: text("url").notNull().unique(),
	type: text("type", { enum: ["image", "document", "video"] }).notNull(), // e.g., 'image', 'pdf', 'video'
	name: text("name").notNull(),
});

export type Attachment = typeof attachment.$inferSelect;
