import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

export const organization = sqliteTable("organization", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	logo: text("logo"),
	metadata: text("metadata"),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const member = sqliteTable("member", {
	id: text("id").primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id),
	role: text("role").notNull(),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const invitation = sqliteTable("invitation", {
	id: text("id").primaryKey(),
	email: text("email").notNull(),
	inviterId: text("inviterId")
		.notNull()
		.references(() => user.id),
	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id),
	role: text("role").notNull(),
	status: text("status").notNull(),
	teamId: text("teamId"),
	expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
});

export const team = sqliteTable("team", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	organizationId: text("organizationId")
		.notNull()
		.references(() => organization.id),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("upatedAt", { mode: "timestamp" }),
});

export const teamMember = sqliteTable("teamMember", {
	id: text("id").primaryKey(),
	teamId: text("teamId")
		.notNull()
		.references(() => team.id),
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export type Organization = typeof organization.$inferSelect;
export type Member = typeof member.$inferSelect;
export type Invitation = typeof invitation.$inferSelect;
export type Team = typeof team.$inferSelect;
export type TeamMember = typeof teamMember.$inferSelect;
