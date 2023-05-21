import { z } from "zod";
import { prisma } from "@/server/db";
import {
  createTRPCRouter,
  adminProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { Role } from "@prisma/client";
import { ServiceSchema } from "./service";

export const User = z.object({
  id: z.string(),
  email: z.string().nullable(),
  name: z.string().nullable(),
  address: z.string().nullable(),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
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

const UpdateUserInput = User.extend({
  providedServices: z.string().array().optional(),
});

const UpdateUserOutput = z.object({
  data: User.extend({
    providedServices: ServiceSchema.array(),
  }),
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
          address: true,
          lat: true,
          lng: true,
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
  me: protectedProcedure.query(async (req) => {
    const { session } = req.ctx;
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        address: true,
        lat: true,
        lng: true,
        name: true,
        memberships: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }),

  updateUser: protectedProcedure
    .meta({ openapi: { method: "PUT", path: "/users/:id" } })
    .input(UpdateUserInput)
    .output(UpdateUserOutput)
    .mutation(async (req) => {
      const { ctx } = req;
      const { session } = ctx;
      const { id, email, name, providedServices, address, lat, lng } =
        req.input;
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
          providedServices: {
            set: validServices,
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          address: true,
          lat: true,
          lng: true,
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
