import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { appRouter } from "../orpc/router";
import { createContext } from "../orpc/utils";
import { auth } from "./handlers/auth";
import { CORS_ORIGINS } from "./handlers/constants";

const app = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>();

const handler = new RPCHandler(appRouter);

app.use(
	"*",
	cors({
		origin: CORS_ORIGINS,
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}
	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.use("/api/rpc/*", async (c, next) => {
	const context = await createContext({ headers: c.req.raw.headers });
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/api/rpc",
		context,
	});
	if (matched) return c.newResponse(response.body, response);
	await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

export default app;
