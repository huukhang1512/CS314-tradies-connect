import { prisma } from "@/server/db";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { PaginatedInput } from "@/types/paginatedInput";

export const paymentRouter = createTRPCRouter({
  getUserPayments: protectedProcedure.query(async (req) => {
    return await prisma.payment.findMany({
      where: {
        userId: req.ctx.session.user.id,
      },
    });
  }),

  paginatedGetUserPayments: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const payments = await prisma.payment.findMany({
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
        data: payments,
      };
    }),

  getPayments: adminProcedure.input(PaginatedInput).mutation(async (req) => {
    const payments = await prisma.payment.findMany({
      include: {
        User: true,
      },
      skip: (req.input.page - 1) * req.input.perPage,
      take: req.input.perPage,
    });
    const total = await prisma.payment.count();
    return {
      total,
      page: req.input.page,
      perPage: req.input.perPage,
      data: payments,
    };
  }),
});
