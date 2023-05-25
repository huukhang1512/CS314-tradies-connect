import { z } from "zod";
import { prisma } from "@/server/db";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { ProposalStatus, RequestStatus } from "@prisma/client";

export const RequestSchema = z.object({
  id: z.string(),
  serviceName: z.string(),
  status: z.string(),
  description: z.string(),
  createdAt: z.date(),
  unit: z.number(),
  price: z.number(),
  clientId: z.string(),
});

export type RequestSchemaType = z.infer<typeof RequestSchema>;

const CreateRequestInput = z.object({
  serviceName: z.string(),
  description: z.string(),
  unit: z.number().positive().default(1),
});

export type CreateRequestInputType = z.infer<typeof CreateRequestInput>;

const CreateRequestOutput = z.object({
  status: z.string(),
  data: RequestSchema.optional(),
});

const UpdateRequestInput = z.object({
  id: z.string(),
  serviceName: z.string(),
  description: z.string(),
  unit: z.number().positive().default(1),
});

export type UpdateRequestInputType = z.infer<typeof UpdateRequestInput>;

const UpdateRequestOutput = z.object({
  status: z.string(),
  data: RequestSchema.optional(),
});

const PaginatedGetRequestInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});

const PaginatedGetRequestOutput = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  data: z.array(RequestSchema),
});

export type PaginatedGetRequestOutputType = z.infer<
  typeof PaginatedGetRequestOutput
>;

const CancelRequestInput = z.object({
  id: z.string(),
});

const CancelRequestOutput = z.object({
  status: z.string(),
});

export const requestRouter = createTRPCRouter({
  createRequest: protectedProcedure
    .meta({ openapi: { method: "POST", path: "/requests" } })
    .input(CreateRequestInput)
    .output(CreateRequestOutput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id } = ctx.session.user;
      const { serviceName, description, unit } = input;
      const service = await prisma.service.findUnique({
        where: {
          name: serviceName,
        },
      });
      if (!service) {
        return {
          status: "Service not found",
        };
      }
      const serviceRate = service.rate;
      const request = await prisma.request.create({
        data: {
          description,
          unit,
          price: serviceRate * unit,
          service: {
            connect: {
              name: serviceName,
            },
          },
          client: {
            connect: {
              id,
            },
          },
        },
        select: {
          id: true,
          serviceName: true,
          status: true,
          description: true,
          createdAt: true,
          unit: true,
          price: true,
          clientId: true,
        },
      });

      return {
        status: "success",
        data: request,
      };
    }),
  getRequests: adminProcedure
    .meta({ openapi: { method: "GET", path: "/requests" } })
    .input(z.object({}))
    .output(z.object({}))
    // eslint-disable-next-line @typescript-eslint/require-await
    .mutation(async (_req) => {
      return {};
    }),
  getRequestsByUser: protectedProcedure
    .input(PaginatedGetRequestInput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { page, perPage } = input;
      const { id } = ctx.session.user;
      const requests = await prisma.request.findMany({
        where: {
          clientId: id,
        },
        select: {
          id: true,
          serviceName: true,
          status: true,
          description: true,
          createdAt: true,
          unit: true,
          price: true,
          clientId: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      });
      const total = await prisma.request.count({ where: { clientId: id } });

      return {
        total,
        page,
        perPage,
        data: requests,
      };
    }),
  updateRequest: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/requests/:requestId" } })
    .input(UpdateRequestInput)
    .output(UpdateRequestOutput)
    .mutation(async (_req) => {
      const { input, ctx } = _req;
      const { id: userId } = ctx.session.user;
      const { id: requestId, serviceName, description, unit } = input;
      const service = await prisma.service.findUnique({
        where: {
          name: serviceName,
        },
      });
      if (!service) {
        return {
          status: "Service not found",
        };
      }
      const serviceRate = service.rate;
      try {
        const request = await prisma.request.update({
          where: {
            id: requestId,
          },
          data: {
            description,
            unit,
            price: serviceRate * unit,
            service: {
              connect: {
                name: serviceName,
              },
            },
            client: {
              connect: {
                id: userId,
              },
            },
          },
          select: {
            id: true,
            serviceName: true,
            status: true,
            description: true,
            createdAt: true,
            unit: true,
            price: true,
            clientId: true,
          },
        });

        return {
          status: "success",
          data: request,
        };
      } catch (_e) {
        return {
          status: "Request not found",
        };
      }
    }),
  cancelRequest: protectedProcedure
    .meta({ openapi: { method: "DELETE", path: "/requests/:requestId" } })
    .input(CancelRequestInput)
    .output(CancelRequestOutput)
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
        request.status == RequestStatus.CANCELLED ||
        request.status == RequestStatus.COMPLETED
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
            status: RequestStatus.CANCELLED,
            proposals: {
              updateMany: {
                where: {
                  requestId,
                },
                data: {
                  status: ProposalStatus.CANCELLED,
                },
              },
            },
          },
        });

        return {
          status: "success",
        };
      } catch (_e) {
        return {
          status: "Internal server error",
        };
      }
    }),
});
