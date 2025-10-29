import { ORPCError, os } from "@orpc/server";
import { db } from "../src/db";
import { auth } from "../src/handlers/auth";
import { getDeviceFromUserAgent } from "../src/handlers/constants";

export async function createContext({ headers }: { headers: Headers }) {
	const authz = await auth.api.getSession({ headers });
	const source = getDeviceFromUserAgent(authz?.session.userAgent ?? "unknown");
	console.log(">>> tRPC Request from", source, "by", authz?.user.email);
	return { user: authz?.user, db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// Utility for a public procedure (doesn't require an authenticated user)
export const publicProcedure = os.$context<Context>();

// Create a utility function for protected tRPC procedures that require an authenticated user.
export const protectedProcedure = publicProcedure.use(({ context, next }) => {
	if (!context.user?.id) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			user: context.user,
		},
	});
});

export const adminProcedure = publicProcedure.use(({ context, next }) => {
	if (!context.user?.role || context.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN");
	}
	return next({
		context: {
			user: context.user,
		},
	});
});
