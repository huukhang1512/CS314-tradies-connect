import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { PaginatedInput } from "@/types/paginatedInput";

const GetServicesByNameRequest = z.string();
const CreateNewServiceRequest = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
  unit: z.string(),
});

const UpdateServiceRequest = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
  unit: z.string(),
});

export const serviceRouter = createTRPCRouter({
  createNewService: adminProcedure
    .input(CreateNewServiceRequest)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
      const { input } = req;
      return await prisma.service.create({
        data: {
          name: input.name,
          rate: input.rate,
          description: input.description,
          unit: input.unit,
        },
      });
    }),

  updateService: adminProcedure
    .input(UpdateServiceRequest)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
      const { input } = req;
      const { name, rate, description, unit } = input;
      return await prisma.service.update({
        where: {
          name,
        },
        data: {
          name,
          rate,
          description,
          unit,
        },
      });
    }),

  getUserProvidedServices: protectedProcedure.query(async (req) => {
    const { ctx } = req;
    const { id } = ctx.session.user;
    const { prisma } = ctx;
    return await prisma.user.findUnique({
      where: { id },
      include: {
        providedServices: true,
      },
    });
  }),

  getServices: protectedProcedure.query(async (req) => {
    const { prisma } = req.ctx;
    return await prisma.service.findMany();
  }),

  paginatedGetServices: adminProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
      const services = await prisma.service.findMany({
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.service.count();
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: services,
      };
    }),

  getServicesByName: protectedProcedure
    .input(GetServicesByNameRequest)
    .mutation(async (req) => {
      const { input } = req;
      const { prisma } = req.ctx;
      return await prisma.service.findMany({
        where: {
          name: {
            contains: input,
            mode: "insensitive",
          },
        },
      });
    }),
});
