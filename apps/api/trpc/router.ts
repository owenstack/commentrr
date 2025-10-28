import { miscellaneousRouter } from "./routes/miscellaneous";
import { userRouter } from "./routes/user";
import { createTRPCRouter } from "./utils";

export const appRouter = createTRPCRouter({
	user: userRouter,
	miscellaneous: miscellaneousRouter,
});

export type AppRouter = typeof appRouter;
