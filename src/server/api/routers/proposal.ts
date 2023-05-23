import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { ProposalStatus, RequestStatus } from "@prisma/client";

const AcceptProposalInput = z.object({
  requestId: z.string(),
  responderId: z.string(),
});

export type AcceptProposalInputType = z.infer<typeof AcceptProposalInput>;

const AcceptProposalOutput = z.object({
  status: z.string(),
});

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
    .input(AcceptProposalInput)
    .output(AcceptProposalOutput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id: userId } = ctx.session.user;
      const { requestId, responderId } = input;
      try {
        return await prisma.$transaction(async (tx) => {
          const request = await tx.request.update({
            where: {
              id: requestId,
            },
            data: {
              status: RequestStatus.IN_PROGRESS,
            },
          });

          if (request.clientId !== userId) {
            throw new Error("Invalid request ID");
          }

          const proposal = await tx.proposal.update({
            where: {
              requestId_providerId: {
                requestId,
                providerId: responderId,
              },
            },
            data: {
              status: ProposalStatus.ACCEPTED,
            },
          });

          await tx.proposal.updateMany({
            where: {
              requestId,
              NOT: {
                OR: [
                  {
                    providerId: responderId,
                  },
                  {
                    status: {
                      in: [ProposalStatus.CANCELLED, ProposalStatus.ACCEPTED],
                    },
                  },
                ],
              },
            },
            data: {
              status: ProposalStatus.REJECTED,
            },
          });

          await tx.job.create({
            data: {
              proposal: {
                connect: {
                  id: proposal.id,
                },
              },
            },
          });

          return {
            status: "Success",
          };
        });
      } catch (_e) {
        return {
          status: "Invalid request or provider ID",
        };
      }
    }),  
});
