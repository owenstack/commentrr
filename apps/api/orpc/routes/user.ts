import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { user } from "../../src/db/auth.schema";
import { protectedProcedure } from "../utils";

export const userRouter = {
	getUser: protectedProcedure.handler(async ({ context }) => {
		return context.user;
	}),
	uploadUserImage: protectedProcedure
		.input(
			z.object({
				image: z.instanceof(File),
			}),
		)
		.handler(async ({ context, input }) => {
			try {
				await env.STORAGE.put(input.image.name, input.image.stream());
				const url = `${env.R2_BASE_URL}/${input.image.name}`;
				await context.db
					.update(user)
					.set({ image: url })
					.where(eq(user.id, context.user.id));
				return { message: "User image updated successfully" };
			} catch (error) {
				console.error("Error uploading user image:", error);
				return {
					error:
						error instanceof Error ? error.message : "Internal server error",
				};
			}
		}),
};
