import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import z from "zod";
import { attachment } from "../../src/db/shared.schema";
import { protectedProcedure } from "../utils";

export const miscellaneousRouter = {
	deleteAttachment: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ context, input }) => {
			try {
				const dbAttachment = await context.db.query.attachment.findFirst({
					where: eq(attachment.id, input.id),
				});
				if (!dbAttachment) {
					return { error: "Failed to find attachment to delete" };
				}
				const key = dbAttachment.url.split(env.R2_BASE_URL)[1];
				await context.db.delete(attachment).where(eq(attachment.id, input.id));
				await env.STORAGE.delete(key);
				return { success: true, message: "Attachment deleted successfully" };
			} catch (error) {
				return {
					error:
						error instanceof Error ? error.message : "Internal server error",
				};
			}
		}),
};
