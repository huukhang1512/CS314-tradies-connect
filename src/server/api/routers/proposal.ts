import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { ProposalStatus, RequestStatus, type JobStatus, type Review } from "@prisma/client";

const AcceptProposalInput = z.object({
  requestId: z.string(),
  responderId: z.string(),
});

const PaginatedGetProposalInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});

export type ProposalWithRequestAndJob = {
  id: string,
  status: ProposalStatus,
  request: {
    address: string | null,
    serviceName: string,
    description: string | null,
    client: {
      name: string | null,
      phoneNumber: string | null,
    },
    price: number,
  },
  job?: {
    status: JobStatus,
    review: Review[],
    startedDate: Date,
    finishedDate: Date | null,
  } | null
}

export type AcceptProposalInputType = z.infer<typeof AcceptProposalInput>;

const AcceptProposalOutput = z.object({
  status: z.string(),
});

const CreateProposalInput = z.object({
  requestId: z.string(),
})


export const proposalRouter = createTRPCRouter({
  createProposal: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/proposals" } })
    .input(CreateProposalInput)
    .output(z.object({}))
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id } = ctx.session.user;
      const { requestId } = input;

      const request = await prisma.request.findFirst({
        where: {
          id: requestId,
          status: RequestStatus.BROADCASTED
        },
      })
      if (!request) {
        return {
          status: "Request not found",
        };
      }
      try {
      await prisma.proposal.create({
        data: {
          request: {
            connect: {
              id: requestId,
            },
          },
          provider: {
            connect: {
              id,
            },
          },
        },
      });
      return {
        status: "Success",
      };
    } catch (_e) {
      return { status: "Internal Server Error"}
    }
    }),
  getProposalById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async (_req) => {
      const { id } = _req.input;
      const proposal = await prisma.proposal.findFirst({
        where: {
          id,
        },
        select: {
          id: true,
          status: true,
          request: {
            select: {
              address: true,
              serviceName: true,
              price: true,
              description: true,
              client: {
                select: {
                  name: true,
                  phoneNumber: true,
                },
              }
            }
          }
        }
      });
      if (!proposal) {
        return null;
      }
      if (proposal.status === ProposalStatus.ACCEPTED) {
        (proposal as ProposalWithRequestAndJob).job = await prisma.job.findFirst({
          where: {
            proposalId: proposal.id,
          },
          select: {
            status: true,
            startedDate: true,
            finishedDate: true,
            review: true
          }
        })
      }
      return proposal as ProposalWithRequestAndJob;
    }),
  getProposalsByUser: protectedProcedure
    .input(PaginatedGetProposalInput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id: userId } = ctx.session.user;
      const { page, perPage } = input;
      const proposals = await prisma.proposal.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        where: {
          providerId: userId,
        },
        select: {
          id: true,
          status: true,
          request: {
            select: {
              address: true,
              serviceName: true,
              price: true,
              description: true,
              client: {
                select: {
                  name: true,
                  phoneNumber: true,
                },
              }
            }
          }
        }
      });
      const total = await prisma.proposal.count({
        where: {
          providerId: userId,
        }
      }) 
      proposals.map(async (p) => {
        if (p.status === ProposalStatus.ACCEPTED) {
          (p as ProposalWithRequestAndJob).job = await prisma.job.findFirst({
            where: {
              proposalId: p.id,
            },
            select: {
              status: true,
              startedDate: true,
              finishedDate: true,
              review: true
            }
          })
        }
      })
      return {
        total,
        page,
        perPage,
        data: proposals as ProposalWithRequestAndJob[]
      };
    }),
  cancelProposal: protectedProcedure
    .input(z.string())
    .mutation(async (_req) => {
      const { input: proposalId } = _req;
      await prisma.proposal.update({
        where: {
          id: proposalId,
        },
        data: {
          status: ProposalStatus.CANCELLED,
        },
      });
      return {
        status: "Success",
      };
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
