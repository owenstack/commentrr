import { env } from "cloudflare:workers";
import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { attachment } from "../../src/db/shared.schema";
import { getPresignedUrl } from "../../src/services/upload.service";
import { protectedProcedure } from "../utils";

export const miscellaneousRouter = {
	createPresignedUrl: protectedProcedure
		.input(
			z.object({
				relationId: z.string(),
				fileName: z.string(),
				fileType: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const { relationId, fileName, fileType } = input;
			const key = `${relationId}/${fileName}`;
			try {
				const url = await getPresignedUrl(key, fileType);
				return { success: true, url, key };
			} catch (error) {
				console.error("Failed to create presigned URL:", error);
				return {
					error:
						error instanceof Error ? error.message : "Internal server error",
				};
			}
		}),
	deleteAttachment: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			try {
				const dbAttachment = await ctx.db.query.attachment.findFirst({
					where: eq(attachment.id, input.id),
				});
				if (!dbAttachment) {
					return { error: "Failed to find attachment to delete" };
				}
				const key = dbAttachment.url.split(env.R2_BASE_URL)[1];
				await ctx.db.delete(attachment).where(eq(attachment.id, input.id));
				await env.STORAGE.delete(key);
				return { success: true, message: "Attachment deleted successfully" };
			} catch (error) {
				return {
					error:
						error instanceof Error ? error.message : "Internal server error",
				};
			}
		}),
} satisfies TRPCRouterRecord;
