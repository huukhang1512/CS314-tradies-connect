import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { serviceRouter } from "./routers/service";
import { requestRouter } from "./routers/request";
import { proposalRouter } from "./routers/proposal";
import { jobRouter } from "./routers/job";
import { membershipRouter } from "./routers/membership";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  services: serviceRouter,
  requests: requestRouter,
  proposals: proposalRouter,
  jobs: jobRouter,
  memberships: membershipRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
