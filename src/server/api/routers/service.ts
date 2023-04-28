import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";

const ChooseServicesRequest = z.string().array();
const GetServicesByNameRequest = z.string();
const CreateNewServiceRequest = z.object({
  name: z.string(),
  rate: z.number(),
});

export const serviceRouter = createTRPCRouter({
  chooseServices: protectedProcedure
    .input(ChooseServicesRequest)
    .mutation(async (req) => {
      const { input: services, ctx } = req;
      const { id } = ctx.session.user;

      const validServices = await prisma.service.findMany({
        where: {
          name: {
            in: services,
          },
        },
        select: {
          name: true,
        },
      });

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          providedServices: {
            set: validServices,
          },
        },
      });
      return updatedUser;
    }),

  createNewService: protectedProcedure
    .input(CreateNewServiceRequest)
    .mutation(async (req) => {
      const { input, ctx } = req;
      const { role } = ctx.session.user;
      if (role !== Role.ADMIN) {
        throw new Error("Only Admin allow to add new service");
      }
      return await prisma.service.create({
        data: {
          name: input.name,
          rate: input.rate,
        },
      });
    }),

  getUserProvidedServices: protectedProcedure.query(async (req) => {
    const { ctx } = req;
    const { id } = ctx.session.user;
    return await prisma.user.findFirst({
      where: { id },
      select: {
        providedServices: true,
      },
    });
  }),

  getServices: protectedProcedure.query(async () => {
    return await prisma.service.findMany();
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
