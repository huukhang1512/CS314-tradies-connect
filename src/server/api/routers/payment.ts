import { prisma } from "@/server/db";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

const PaginatedGetPaymentsInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});
export const paymentRouter = createTRPCRouter({
  getUserPayments: protectedProcedure.query(async (req) => {
    return await prisma.payment.findMany({
      where: {
        userId: req.ctx.session.user.id,
      },
    });
  }),

  paginatedGetUserPayments: protectedProcedure
    .input(PaginatedGetPaymentsInput)
    .mutation(async (req) => {
      const services = await prisma.payment.findMany({
        where: {
          userId: req.ctx.session.user.id,
        },
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.payment.count();
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: services,
      };
    }),

  getPayments: adminProcedure
    .input(PaginatedGetPaymentsInput)
    .mutation(async (req) => {
      const services = await prisma.payment.findMany({
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.payment.count();
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: services,
      };
    }),
});
