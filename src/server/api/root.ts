import { createTRPCRouter } from "@/server/api/trpc";
<<<<<<< HEAD
import { exampleRouter } from "@/server/api/routers/example";
import { userRouter } from "./routers/user";
import { serviceRouter } from "./routers/service";
import { requestRouter } from "./routers/request";
import { proposalRouter } from "./routers/proposal";
import { jobRouter } from "./routers/job";
=======
import { tradieRouter } from "@/server/api/routers/tradie";
import { userRouter } from "./routers/user";
>>>>>>> 28fbfea (trial with changing user profile info)

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
<<<<<<< HEAD
  example: exampleRouter,
  users: userRouter,
  services: serviceRouter,
  requests: requestRouter,
  proposals: proposalRouter,
  jobs: jobRouter,
=======
  tradie: tradieRouter,
  user: userRouter,
>>>>>>> 28fbfea (trial with changing user profile info)
});

// export type definition of API
export type AppRouter = typeof appRouter;
