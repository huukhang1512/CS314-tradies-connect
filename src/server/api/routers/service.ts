import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { User } from "./user";

const ChooseServicesRequest = z.object({
  services: z.string().array()});

export const Service = z.object({
  name: z.string(),
  description: z.string().optional(),
  rate: z.number(),
});

export const GetServicesOutput = z.array(Service);

export const serviceRouter = createTRPCRouter({
  chooseServices: protectedProcedure
  .meta({ openapi: { method: "POST", path: "/services" } })
  .input(ChooseServicesRequest)
  .output(User)
  .mutation(async (req) => {
    const { input, ctx } = req;
    const { services } = input;
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
      where: {
        id: id,
      },
      data: {
        providedServices: {
          set: validServices,
        },
      },
    });
    return updatedUser;
  }),
  getServices: protectedProcedure
  .meta({ openapi: { method: "GET", path: "/services" } })
  .input(z.object({}))
  .output(GetServicesOutput) 
  .mutation(async () => {
    const services = await prisma.service.findMany()
    return services;
  })
});
