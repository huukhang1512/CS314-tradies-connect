import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";

const CreateRatingInput = z.object({
  requestId: z.string(),
  rating: z.number(),
  comment: z.string(),
})  

export type CreateRatingInputType = z.infer<typeof CreateRatingInput>

const CreateRatingOutput = z.object({
  status: z.string()
})

export const ratingRouter = createTRPCRouter({
  createRating: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/rating" } })
    .input(CreateRatingInput)
    .output(CreateRatingOutput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id: userId } = ctx.session.user;
      const { requestId, rating, comment } = input;
      const request = await prisma.request.findFirst({
        where: {
          id: requestId,
          clientId: userId,
        },
      });
      if (!request) {
        return {
          status: "Invalid Request ID",
        };
      }

      const proposal = await prisma.proposal.findFirst({
        where: {
          requestId: requestId,
          
          jobs: {
            some: {
            }
          }
        },
        select: {
          providerId: true,
          jobs: true,
        }
      });
      
      if (!proposal) {
        return {
          status: "Job not found",
        };
      }

      const jobId = proposal.jobs[0]?.id;
      const providerId = proposal.providerId;

      await prisma.review.create({
        data: {
          rating,
          comment,
          job: {
            connect: {
              id: jobId,
            },
          },
          sender: {
            connect: {
              id: userId,
            },
          },
          recipient: {
            connect: {
              id: providerId,
            },
          },
        }
      })

      return {
        status: "success",
      };
    }),
});