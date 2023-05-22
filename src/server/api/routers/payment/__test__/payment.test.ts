import { test, expect } from "@jest/globals";
import { type AppRouter, appRouter } from "../../../root";
import { type PrismaClient, PaymentType, PaymentStatus } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import { type inferProcedureOutput } from "@trpc/server";
import { createInnerTRPCContext } from "../../../trpc";
import { fakeAdminSession, fakeUser, fakeUserSession } from "@/fakes/fakeUser";

const prismaMock = mockDeep<PrismaClient>();

afterEach(() => jest.clearAllMocks());

test("getPayments test", async () => {
  type Output = inferProcedureOutput<AppRouter["payments"]["getPayments"]>;
  const mockOutput: Output["data"] = [
    {
      amount: 10,
      createdAt: new Date(),
      id: "random-id",
      paymentType: PaymentType.CLIENT_MEMBERSHIP,
      paymentStatus: PaymentStatus.COMPLETED,
      User: fakeUser,
      jobId: null,
      userId: fakeUser.id,
    },
  ];
  prismaMock.payment.findMany.mockResolvedValue(mockOutput);
  prismaMock.payment.count.mockResolvedValue(1);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeAdminSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.payments.getPayments({ page: 1, perPage: 10 });

  expect(result).toMatchObject({
    total: 1,
    page: 1,
    perPage: 10,
    data: mockOutput,
  });
});

test("getUserPayments test", async () => {
  type Output = inferProcedureOutput<AppRouter["payments"]["getUserPayments"]>;
  const mockOutput: Output = [
    {
      amount: 10,
      createdAt: new Date(),
      id: "random-id",
      paymentType: PaymentType.CLIENT_MEMBERSHIP,
      paymentStatus: PaymentStatus.COMPLETED,
      userId: fakeUser.id,
      jobId: null,
    },
  ];
  prismaMock.payment.findMany.mockResolvedValue(mockOutput);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.payments.getUserPayments();

  expect(result).toMatchObject(mockOutput);
});

test("paginatedGetUserPayments test", async () => {
  type Output = inferProcedureOutput<
    AppRouter["payments"]["paginatedGetUserPayments"]
  >;
  const mockOutput: Output["data"] = [
    {
      amount: 10,
      createdAt: new Date(),
      id: "random-id",
      paymentType: PaymentType.CLIENT_MEMBERSHIP,
      paymentStatus: PaymentStatus.COMPLETED,
      jobId: null,
      userId: fakeUser.id,
    },
  ];
  prismaMock.payment.findMany.mockResolvedValue(mockOutput);
  prismaMock.payment.count.mockResolvedValue(1);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.payments.paginatedGetUserPayments({
    page: 1,
    perPage: 10,
  });

  expect(result).toMatchObject({
    total: 1,
    page: 1,
    perPage: 10,
    data: mockOutput,
  });
});
