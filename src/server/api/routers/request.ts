import { z } from "zod";
import { prisma } from "@/server/db";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { User } from "./user";

const CreateRequestInput = z.object({});

export const requestRouter = createTRPCRouter({
  createRequest: protectedProcedure
  .meta({ openapi: { method: "POST", path: "/requests" } })
  .input(CreateRequestInput)
  .output(CreateRequestInput)
  .mutation(async (req) => {
    const { input, ctx } = req;
    const { id } = ctx.session.user;

    return {};
  }),
  getRequests: adminProcedure
  .meta({ openapi: { method: "GET", path: "/requests" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  getRequestsByUser: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/requests/:userId" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  updateRequest: protectedProcedure
  .meta({ openapi: { method: "PUT", path: "/requests/:requestId" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  cancelRequest: protectedProcedure
  .meta({ openapi: { method: "DELETE", path: "/requests/:requestId" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),


});
