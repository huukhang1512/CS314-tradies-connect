import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const proposalRouter = createTRPCRouter({
  createProposals: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/proposals" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id } = ctx.session.user;
      console.log(input, id);
      return {};
    }),
  getProposals: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/proposals" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
  cancelProposal: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/proposals/:requestId" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
  acceptProposal: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/proposals/accept" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
});
