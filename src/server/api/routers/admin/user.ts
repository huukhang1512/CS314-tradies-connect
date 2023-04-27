import { z } from "zod";
import { prisma } from "@/server/db";
import { createTRPCRouter, adminProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";

const PaginatedQueryInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});

const PaginatedQueryOutput = z.object({
  total: z.number().positive(),
  page: z.number().positive(),
  perPage: z.number().positive(),
  users: z.array(
    z.object({
      id: z.string(),
      email: z.string().nullable(),
      name: z.string().nullable(),
    })
    ),
  });
  
export type PaginatedQueryInputType = z.infer<typeof PaginatedQueryInput>
export type PaginatedQueryOutputType = z.infer<typeof PaginatedQueryOutput>

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure
  .meta({ openapi: { method: 'GET', path: '/admin/users' } })
  .input(PaginatedQueryInput)
  .output(PaginatedQueryOutput)
  .query(async (req) => {
    const users = await prisma.user.findMany({
      skip: (req.input.page - 1) * req.input.perPage,
      take: req.input.perPage,
      select: {
        id: true,
        email: true,
        name: true,
      },
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
      data: users,
    };
  })
  ,
});
