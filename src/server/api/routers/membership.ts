import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MembershipType, PaymentStatus, PaymentType } from "@prisma/client";
import { PaginatedInput } from "@/types/paginatedInput";

const SubscribeToMembershipInput = z.object({
  membershipId: z.string(),
});

const CancelMembershipInput = z.object({
  membershipId: z.string(),
});

export const membershipRouter = createTRPCRouter({
  getMemberships: protectedProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
      const { prisma } = req.ctx;
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

  getClientMemberships: protectedProcedure.query(async (req) => {
    const { prisma } = req.ctx;
    return await prisma.membership.findMany({
      where: {
        type: MembershipType.CLIENT,
      },
    });
  }),

  getTradieMemberships: protectedProcedure.query(async (req) => {
    const { prisma } = req.ctx;
    return await prisma.membership.findMany({
      where: {
        type: MembershipType.PROVIDER,
      },
    });
  }),

  getUserActiveMembership: protectedProcedure.query(async (req) => {
    const { session, prisma } = req.ctx;
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
      const { session, prisma } = req.ctx;
      const { membershipId } = req.input;
      const today = new Date();
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
      });
      if (!membership) throw new Error("Membership not found");
      const userMembership = await prisma.userMembership.findUnique({
        where: {
          userId_membershipId: {
            userId: session.user.id,
            membershipId: membership.id,
          },
        },
      });
      // if user membership is cancelled but has not expired -> do not charge, but renewed
      if (
        userMembership &&
        !userMembership.isAutoRenew &&
        userMembership.expiredAt &&
        userMembership.expiredAt > today
      ) {
        await prisma.userMembership.update({
          where: {
            userId_membershipId: {
              userId: session.user.id,
              membershipId: membership.id,
            },
          },
          data: {
            isAutoRenew: true,
          },
        });
        return;
      }
      // if the membership is expired with no autorenew
      today.setDate(today.getDate() + membership.duration);
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          memberships: {
            ...(userMembership
              ? {
                  update: {
                    data: { membershipId, expiredAt: today },
                    where: {
                      userId_membershipId: {
                        userId: session.user.id,
                        membershipId: membership.id,
                      },
                    },
                  },
                }
              : { create: { membershipId, expiredAt: today } }),
          },
          payments: {
            create: {
              amount: membership.price,
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

  cancelMembership: protectedProcedure
    .input(CancelMembershipInput)
    .mutation(async (req) => {
      const { session, prisma } = req.ctx;
      const { membershipId } = req.input;
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
      });
      if (!membership) {
        throw new Error("Membership not found");
      }
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          memberships: {
            update: {
              where: {
                userId_membershipId: {
                  userId: session.user.id,
                  membershipId: membership.id,
                },
              },
              data: {
                isAutoRenew: false,
              },
            },
          },
        },
      });
    }),
});
