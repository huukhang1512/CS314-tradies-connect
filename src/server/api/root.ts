import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "./routers/user";
import { serviceRouter } from "./routers/service";
import { requestRouter } from "./routers/request";
import { proposalRouter } from "./routers/proposal";
import { jobRouter } from "./routers/job";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: userRouter,
  services: serviceRouter,
  requests: requestRouter,
  proposals: proposalRouter,
  jobs: jobRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
