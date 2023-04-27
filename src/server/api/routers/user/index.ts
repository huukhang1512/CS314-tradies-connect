import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  changeUserInfo: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        providedServices: z.string().array().optional(),
        location: z.string(),
      })
    )
    .mutation(async (req) => {
      const { input, ctx } = req;
      const { id } = ctx.session.user;
      const validServices = await prisma.service.findMany({
        where: {
          name: {
            in: input.providedServices,
          },
        },
        select: {
          name: true,
        },
      });

      return await prisma.user.update({
        where: { id },
        data: {
          name: input.name,
          providedServices: {
            set: validServices,
          },
        },
      });
    }),
});
