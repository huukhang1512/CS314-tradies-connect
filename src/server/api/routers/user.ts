import { z } from "zod";
import { prisma } from "@/server/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Role } from "@prisma/client";

export const User = z.object({
  id: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
});

const PaginatedGetUsersInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});

const PaginatedGetUsersOutput = z.object({
  total: z.number(),
  page: z.number().positive(),
  perPage: z.number().positive(),
  data: z.array(User),
});

const GetUserInput = z.object({
  id: z.string(),
});

const GetUserOutput = z.object({
  data: User,
});

const UpdateUserInput = User;

const UpdateUserOutput = z.object({
  data: User,
});

export type PaginatedQueryInputType = z.infer<typeof PaginatedGetUsersInput>;
export type PaginatedQueryOutputType = z.infer<typeof PaginatedGetUsersOutput>;

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure
    .meta({ openapi: { method: "GET", path: "/users" } })
    .input(PaginatedGetUsersInput)
    .output(PaginatedGetUsersOutput)
    .mutation(async (req) => {
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
    }),
  getUser: protectedProcedure
    .meta({ openapi: { method: "GET", path: "/users/:id" } })
    .input(GetUserInput)
    .output(GetUserOutput)
    .query(async (req) => {
      const user = await prisma.user.findUnique({
        where: {
          id: req.input.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return { data: user };
    }),
  updateUser: adminProcedure
    .meta({ openapi: { method: "PUT", path: "/users/:id" } })
    .input(UpdateUserInput)
    .output(UpdateUserOutput)
    .mutation(async (req) => {
      const user = await prisma.user.update({
        where: {
          id: req.input.id,
        },
        data: {
          email: req.input.email,
          name: req.input.name,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return { data: user };
    }),
});
