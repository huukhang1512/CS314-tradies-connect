import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "./routers/user";
import { serviceRouter } from "./routers/service";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: userRouter,
  service: serviceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
