import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./user";

export const adminRouter = createTRPCRouter({
  user: userRouter,
});