import { miscellaneousRouter } from "./routes/miscellaneous";
import { userRouter } from "./routes/user";

export const appRouter = {
	user: userRouter,
	miscellaneous: miscellaneousRouter,
};

export type AppRouter = typeof appRouter;
