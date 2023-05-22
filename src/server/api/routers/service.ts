import { z } from "zod";
import { prisma } from "@/server/db";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { PaginatedInput } from "@/types/paginatedInput";

export const ServiceSchema = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
});

const GetServicesByNameRequest = z.string();
const CreateNewServiceRequest = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
});

const UpdateServiceRequest = z.object({
  name: z.string(),
  rate: z.number(),
  description: z.string(),
});

export const serviceRouter = createTRPCRouter({
  createNewService: adminProcedure
    .input(CreateNewServiceRequest)
    .mutation(async (req) => {
      const { input } = req;
      return await prisma.service.create({
        data: {
          name: input.name,
          rate: input.rate,
          description: input.description,
        },
      });
    }),

  updateService: adminProcedure
    .input(UpdateServiceRequest)
    .mutation(async (req) => {
      const { input } = req;
      const { name, rate, description } = input;
      return await prisma.service.update({
        where: {
          name,
        },
        data: {
          name,
          rate,
          description,
        },
      });
    }),

  getUserProvidedServices: protectedProcedure.query(async (req) => {
    const { ctx } = req;
    const { id } = ctx.session.user;
    return await prisma.user.findUnique({
      where: { id },
      select: {
        providedServices: true,
      },
    });
  }),

  getServices: protectedProcedure.query(async () => {
    return await prisma.service.findMany();
  }),

  paginatedGetServices: adminProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
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
