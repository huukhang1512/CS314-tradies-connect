import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { PaginatedInput } from "@/types/paginatedInput";
import { PaymentType } from "@prisma/client";

export const paymentRouter = createTRPCRouter({
  getUserPayments: protectedProcedure.query(async (req) => {
    const { prisma } = req.ctx;
    return await prisma.payment.findMany({
      where: {
        userId: req.ctx.session.user.id,
      },
    });
  }),

  paginatedGetUserPayments: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const { prisma } = req.ctx;

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
    const { prisma } = req.ctx;
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

  getClientRequestPayment: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
      const payments = await prisma.payment.findMany({
        include: {
          User: true,
        },
        where: {
          paymentType: PaymentType.REQUEST,
        },
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.payment.count({
        where: {
          paymentType: PaymentType.REQUEST,
        },
      });
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: payments,
      };
    }),

  getTradieJobPayoutPayment: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
      const payments = await prisma.payment.findMany({
        include: {
          User: true,
        },
        where: {
          paymentType: PaymentType.JOB_PAYOUT,
        },
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.payment.count({
        where: {
          paymentType: PaymentType.JOB_PAYOUT,
        },
      });
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: payments,
      };
    }),
});
