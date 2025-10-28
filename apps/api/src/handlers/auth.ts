import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { admin, magicLink, organization } from "better-auth/plugins";
import { db } from "../db";
import { magicLinkEmailString } from "../emails/magic-link";
import { validateEmail } from "../lib/validator";
import { mailer } from "../services/email.service";
import { CORS_ORIGINS } from "./constants";

export const auth = betterAuth({
	appName: "commentrr.efobi.dev",
	baseURL: env.BASE_URL,
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	plugins: [
		organization(),
		admin(),
		magicLink({
			sendMagicLink: async ({ email, url }) => {
				try {
					const emailString = magicLinkEmailString({ magicLink: url });
					await mailer.send({
						from: "commentrr.efobi.dev support <no-reply@mail.efobi.dev>",
						to: email,
						subject: "Your magic link",
						html: emailString,
						priority: "high",
					});
				} catch (error) {
					throw new APIError("INTERNAL_SERVER_ERROR", {
						message: (error as Error).message,
					});
				}
			},
		}),
	],
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path !== "/sign-in/magic-link") {
				return;
			}
			try {
				await validateEmail(ctx.body.email);
			} catch (error) {
				throw new APIError("BAD_REQUEST", {
					message: (error as Error).message,
				});
			}
		}),
	},
	advanced: {
		crossSubDomainCookies: {
			enabled: true,
			domain:
				env.ENVIRONMENT === "development" ? undefined : "commentrr.efobi.dev",
		},
	},
	trustedOrigins: CORS_ORIGINS,
});
