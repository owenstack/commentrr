import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
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

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => ({
		...shape,
		data: {
			...shape.data,
			zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
		},
	}),
});
// Create a caller factory for making server-side tRPC calls from loaders or actions.
export const createCallerFactory = t.createCallerFactory;

// Utility for creating a tRPC router
export const createTRPCRouter = t.router;

// Utility for a public procedure (doesn't require an authenticated user)
export const publicProcedure = t.procedure;

// Create a utility function for protected tRPC procedures that require an authenticated user.
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.user?.id) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			user: ctx.user,
		},
	});
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.user?.role || ctx.user.role !== "admin") {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next({
		ctx: {
			user: ctx.user,
		},
	});
});
