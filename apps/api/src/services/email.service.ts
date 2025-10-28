import { env } from "cloudflare:workers";
import { Mailer } from "@efobi/mailer";

export const mailer = new Mailer({
	host: env.SMTP_HOST,
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD,
	},
});
