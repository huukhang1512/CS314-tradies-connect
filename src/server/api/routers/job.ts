import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import {
  PaymentStatus,
  PaymentType,
  ProposalStatus,
  RequestStatus,
} from "@prisma/client";
import { COMMISSION } from "@/constant";

const CompleteJobInput = z.object({
  id: z.string(),
});

const CompleteJobOutput = z.object({
  status: z.string(),
});

export const jobRouter = createTRPCRouter({
  getJobs: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/jobs" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
  getJobById: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/jobs/:id" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
  completeJob: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/jobs/complete" } })
    .input(CompleteJobInput)
    .output(CompleteJobOutput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id: userId } = ctx.session.user;
      const { id: requestId } = input;

      const request = await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
      if (
        !request ||
        request.clientId !== userId ||
        request.status !== RequestStatus.IN_PROGRESS
      ) {
        return {
          status: "Invalid request ID",
        };
      }

      try {
        await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            status: RequestStatus.COMPLETED,
          },
        });

        // assuming that only one accepted proposal
        const proposal = await prisma.proposal.findFirst({
          where: {
            requestId: requestId,
            status: ProposalStatus.ACCEPTED,
          },
          include: {
            jobs: {
              include: {
                proposal: true,
              },
            },
          },
        });

        const jobId = proposal?.jobs.find(
          (job) => job.proposal.id === proposal.id
        )?.id;

        await prisma.proposal.update({
          where: {
            id: proposal?.id,
          },
          data: {
            jobs: {
              update: {
                where: {
                  id: jobId,
                },
                data: {
                  finishedDate: new Date(),
                  payment: {
                    create: {
                      userId: proposal?.providerId,
                      amount: request.price - request.price * COMMISSION,
                      paymentStatus: PaymentStatus.COMPLETED,
                      paymentType: PaymentType.JOB_PAYOUT,
                    },
                  },
                },
              },
            },
          },
        });

        return {
          status: "Success",
        };
      } catch (_e) {
        return {
          status: "Internal Server Error",
        };
      }
    }),
});
