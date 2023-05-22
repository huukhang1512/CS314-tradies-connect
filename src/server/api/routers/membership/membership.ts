import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MembershipType, PaymentStatus, PaymentType } from "@prisma/client";
import { PaginatedInput } from "@/types/paginatedInput";

const SubscribeToMembershipInput = z.object({
  membershipId: z.string(),
});

export const membershipRouter = createTRPCRouter({
  getMemberships: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const memberships = await prisma.membership.findMany({
        skip: (req.input.page - 1) * req.input.perPage,
        take: req.input.perPage,
      });
      const total = await prisma.membership.count();
      return {
        total,
        page: req.input.page,
        perPage: req.input.perPage,
        data: memberships,
      };
    }),

  getClientMemberships: protectedProcedure.query(async () => {
    return await prisma.membership.findMany({
      where: {
        type: MembershipType.CLIENT,
      },
    });
  }),

  getTradieMemberships: protectedProcedure.query(async () => {
    return await prisma.membership.findMany({
      where: {
        type: MembershipType.PROVIDER,
      },
    });
  }),

  getUserActiveMembership: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    return await prisma.userMembership.findMany({
      where: {
        user: {
          id: session.user.id,
        },
        expiredAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
        membership: true,
      },
    });
  }),

  subscribeToMembership: protectedProcedure
    .input(SubscribeToMembershipInput)
    .mutation(async (req) => {
      const { session } = req.ctx;
      const { membershipId } = req.input;
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
      });
      const today = new Date();
      today.setDate(today.getDate() + (membership?.duration || 0));
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          memberships: {
            create: { membershipId: membershipId, expiredAt: today },
          },
          payments: {
            create: {
              amount: membership?.price || 0,
              paymentStatus: PaymentStatus.COMPLETED,
              paymentType:
                membership?.type === MembershipType.CLIENT
                  ? PaymentType.CLIENT_MEMBERSHIP
                  : PaymentType.PROVIDER_MEMBERSHIP,
            },
          },
        },
      });
    }),
});
