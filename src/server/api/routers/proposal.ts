import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";


export const proposalRouter = createTRPCRouter({
  createProposals: protectedProcedure
  .meta({ openapi: { method: "POST", path: "/proposals" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    const { input, ctx } = req;
    const { id } = ctx.session.user;

    return {};
  }),
  getProposals: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/proposals" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  cancelProposal: protectedProcedure
  .meta({ openapi: { method: "DELETE", path: "/proposals/:requestId" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),
  acceptProposal: protectedProcedure
  .meta({ openapi: { method: "POST", path: "/proposals/accept" } })
  .input(z.object({}))
  .output(z.object({}))
  .mutation(async (req) => {
    return {}
  }),

});
