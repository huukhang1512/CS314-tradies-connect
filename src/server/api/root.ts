import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { tradieRouter } from "@/server/api/routers/tradie";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  tradie: tradieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
