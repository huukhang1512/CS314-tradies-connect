import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { adminRouter } from "./routers/admin";
import { tradieRouter } from "@/server/api/routers/tradie";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  admin: adminRouter,
  tradie: tradieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
