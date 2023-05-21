import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { MembershipType, PaymentStatus, PaymentType } from "@prisma/client";

const SubscribeToMembershipInput = z.object({
  membershipId: z.string(),
});

export const membershipRouter = createTRPCRouter({
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

  subscribeToMembership: protectedProcedure
    .input(SubscribeToMembershipInput)
    .mutation(async (req) => {
      const { session } = req.ctx;
      const { membershipId } = req.input;
      const membership = await prisma.membership.findUnique({
        where: { id: membershipId },
      });
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          memberships: {
            connect: {
              id: membershipId,
            },
          },
          payments: {
            create: {
              amount: membership?.price || 0,
              paymentStatus: PaymentStatus.COMPLETED,
              paymentType: PaymentType.CLIENT_MEMBERSHIP,
            },
          },
        },
      });
    }),
});
