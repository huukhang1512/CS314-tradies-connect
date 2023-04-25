import { z } from "zod";
import { prisma } from "@/server/db";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

const Services = z.string().array();

export const serviceRouter = createTRPCRouter({
  chooseServices: protectedProcedure
    .input(Services)
    .mutation( async (req) => {
      const { input: services, ctx } = req;
      const { id } = ctx.session.user;
      const validServices = await prisma.service.findMany({
        where: {
          name: {
            in: services,
          }
        },
        select: {
          name: true
        }
      })
      const updatedUser = await prisma.user.update({
        where: {
          id: id
        },
        data: {
          providedServices: {
            set: validServices
          }
        }
      })
      return updatedUser;
    }),
});