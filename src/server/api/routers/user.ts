import { z } from "zod";
import { prisma } from "@/server/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Role } from "@prisma/client";
import { PaginatedInput } from "@/types/paginatedInput";

export const User = z.object({
  id: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  address: z.string().nullable(),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  createdAt: z.date().nullable(),
});

const PaginatedGetUsersOutput = z.object({
  total: z.number(),
  page: z.number().positive(),
  perPage: z.number().positive(),
  data: z.array(User),
});

const UpdateUserInput = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  lat: z.string(),
  lng: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  providedServices: z.string().array().optional(),
});

export type PaginatedQueryOutputType = z.infer<typeof PaginatedGetUsersOutput>;

export const userRouter = createTRPCRouter({
  getUsers: adminProcedure
    .input(PaginatedInput)
    .mutation(async (req) => {
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
        data: users,
      };
    }),
  me: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        memberships: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),

  updateUser: protectedProcedure
    .input(UpdateUserInput)
    .mutation(async (req) => {
      const { ctx } = req;
      const { session } = ctx;
      const {
        id,
        email,
        name,
        providedServices,
        address,
        lat,
        lng,
        phoneNumber,
      } = req.input;
      if (session.user.id !== req.input.id) {
        throw new Error("Only user can change their details");
      }
      const validServices = await prisma.service.findMany({
        where: {
          name: {
            in: providedServices,
          },
        },
        select: {
          name: true,
        },
      });

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          name,
          address,
          lat,
          lng,
          phoneNumber,
          providedServices: {
            set: validServices,
          },
        },
        include: {
          providedServices: true,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return {
        data: {
          ...user,
          providedServices: user.providedServices.map((service) => ({
            name: service.name,
            rate: service.rate,
            description: service.description,
          })),
        },
      };
    }),
});
