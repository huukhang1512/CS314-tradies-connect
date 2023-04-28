import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";


export const jobRouter = createTRPCRouter({
  getJobs: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/jobs" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  getJobById: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/jobs/:id" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  completeJob: protectedProcedure
  .meta({ openapi: { method: "POST", path: "/jobs/complete" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),

});
