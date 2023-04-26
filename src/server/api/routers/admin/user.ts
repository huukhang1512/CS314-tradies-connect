import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";

const PaginatedQueryInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure.input(PaginatedQueryInput).query(async (req) => {
    const users = await prisma.user.findMany({
      skip: (req.input.page - 1) * req.input.perPage,
      take: req.input.perPage,
      where: {
        role: {
          not: Role.ADMIN,
        },
      },
    });
    const count = await prisma.user.count({
      where: {
        role: {
          not: Role.ADMIN,
        },
      },
    });
    return {
      total: count,
      page: req.input.page,
      perPage: req.input.perPage,
      users,
    };
  }),
});
