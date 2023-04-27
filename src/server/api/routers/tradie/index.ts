import { createTRPCRouter } from "@/server/api/trpc";
import { serviceRouter } from "./service";

export const tradieRouter = createTRPCRouter({
  service: serviceRouter,
});