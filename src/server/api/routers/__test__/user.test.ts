import { test, expect } from "@jest/globals";
import { type AppRouter, appRouter } from "../../root";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import {
  type inferProcedureInput,
  type inferProcedureOutput,
} from "@trpc/server";
import { createInnerTRPCContext } from "../../trpc";
import { fakeAdminSession, fakeUser, fakeUserSession } from "@/fakes/fakeUser";
import { SERVICES } from "@/fakes/fakeServices";
import { CLIENT_MEMBERSHIP } from "@/constant";

const prismaMock = mockDeep<PrismaClient>();

afterEach(() => jest.clearAllMocks());

test("getUsers test", async () => {
  const mockUsers = [fakeUser];
  prismaMock.user.findMany.mockResolvedValue(mockUsers);
  prismaMock.user.count.mockResolvedValue(mockUsers.length);
  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeAdminSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.users.getUsers({ page: 1, perPage: 10 });

  expect(result).toMatchObject({
    total: mockUsers.length,
    page: 1,
    perPage: 10,
    data: mockUsers,
  });
});

test("me test", async () => {
  type Output = inferProcedureOutput<AppRouter["users"]["me"]>;
  const mockUser: Output = {
    ...fakeUser,
    memberships: [
      {
        ...CLIENT_MEMBERSHIP,
        userId: fakeUser.id,
        membershipId: "membership-id",
        createdAt: new Date(),
        expiredAt: new Date(),
      },
    ],
  };
  prismaMock.user.findUnique.mockResolvedValue(mockUser);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.users.me();

  expect(result).toMatchObject(mockUser);
});

test("updateUser test", async () => {
  type Output = inferProcedureOutput<AppRouter["users"]["updateUser"]>;
  type Input = inferProcedureInput<AppRouter["users"]["updateUser"]>;

  const user = { ...fakeUser, providedServices: SERVICES };
  const input: Input = {
    address: "123 street",
    lng: "3.3",
    email: "test@example.com",
    id: "test-user-id",
    name: "name",
    lat: "3.3",
    phoneNumber: "0123456789",
  };
  const mockOutput: Output = {
    data: {
      ...user,
      ...input,
      providedServices: SERVICES,
    },
  };
  prismaMock.user.update.mockResolvedValue({ ...user, ...input });

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.users.updateUser(input);

  expect(result).toMatchObject(mockOutput);
});

test("updateUser test with different user should throw error", async () => {
  type Input = inferProcedureInput<AppRouter["users"]["updateUser"]>;
  const input: Input = {
    address: "123 street",
    lng: "3.3",
    email: "test@example.com",
    id: "different-user-id",
    name: "name",
    lat: "3.3",
    phoneNumber: "0123456789",
  };
  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  await expect(caller.users.updateUser(input)).rejects.toThrowError();
});
