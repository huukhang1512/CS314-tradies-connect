import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user/user";
import { serviceRouter } from "./routers/service/service";
import { requestRouter } from "./routers/request/request";
import { proposalRouter } from "./routers/proposal/proposal";
import { jobRouter } from "./routers/job/job";
import { ratingRouter } from "./routers/rating";
import { membershipRouter } from "./routers/membership/membership";
import { paymentRouter } from "./routers/payment/payment";

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
  rating: ratingRouter,
  memberships: membershipRouter,
  payments: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
