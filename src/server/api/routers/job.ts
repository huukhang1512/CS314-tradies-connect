import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import {
  Membership,
  MembershipType,
  PaymentStatus,
  PaymentType,
  ProposalStatus,
  RequestStatus,
} from "@prisma/client";
import { COMMISSION } from "@/constant";
import { membershipRouter } from "./membership";

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
        include: {
          client: {
            include: {
              memberships: true,
            },
          },
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
        await prisma.$transaction(async (tx) => {
          // assuming that only one accepted proposal
          const proposal = await tx.proposal.findFirst({
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

          const job = proposal?.jobs.find(
            (job) => job.proposal.id === proposal.id
          );

          await tx.proposal.update({
            where: {
              id: proposal?.id,
            },
            data: {
              jobs: {
                update: {
                  where: {
                    id: job?.id,
                  },
                  data: {
                    finishedDate: new Date(),
                    payment: {
                      createMany: {
                        data: [
                          {
                            userId: proposal?.providerId,
                            amount: request.price - request.price * COMMISSION,
                            paymentStatus: PaymentStatus.COMPLETED,
                            paymentType: PaymentType.JOB_PAYOUT,
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          });

          const userMembership = await membershipRouter
            .createCaller({
              prisma,
              session: ctx.session,
            })
            .getUserActiveMembership();

          // charge the client if no membership
          if (
            !userMembership.some(
              (mem) => mem.membership.type === MembershipType.CLIENT
            )
          )
            await tx.job.update({
              where: { id: job?.id },
              data: {
                payment: {
                  create: {
                    userId: request.clientId,
                    amount: request.price,
                    paymentStatus: PaymentStatus.COMPLETED,
                    paymentType: PaymentType.REQUEST,
                  },
                },
              },
            });
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
