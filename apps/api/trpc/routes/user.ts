import { env } from "cloudflare:workers";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { user } from "../../src/db/auth.schema";
import { attachment } from "../../src/db/shared.schema";
import { protectedProcedure } from "../utils";

export const userRouter = {
	getUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	updateUserImage: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				name: z.string(),
				type: z.enum(["image", "video", "document"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { key, name, type } = input;
			const url = `${env.R2_BASE_URL}/${key}`;
			try {
				await ctx.db.insert(attachment).values({
					relationId: ctx.user.id,
					url,
					name,
					type,
				});
				await ctx.db
					.update(user)
					.set({ image: url })
					.where(eq(user.id, ctx.user.id));
				return { success: true, message: "Profile image updated successfully" };
			} catch (error) {
				return {
					error:
						error instanceof Error
							? error.message
							: "Failed to update profile image",
				};
			}
		}),
} satisfies TRPCRouterRecord;
