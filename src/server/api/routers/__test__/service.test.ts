import { test, expect } from "@jest/globals";
import { type AppRouter, appRouter } from "../../root";
import { type PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";
import { type inferProcedureOutput } from "@trpc/server";
import { createInnerTRPCContext } from "../../trpc";
import { fakeAdminSession, fakeUser, fakeUserSession } from "@/fakes/fakeUser";
import { SERVICES } from "@/fakes/fakeServices";

const prismaMock = mockDeep<PrismaClient>();

afterEach(() => jest.clearAllMocks());

test("getServices test", async () => {
  prismaMock.service.findMany.mockResolvedValue(SERVICES);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.getServices();

  expect(result).toMatchObject(SERVICES);
});

test("paginatedGetServices test", async () => {
  prismaMock.service.findMany.mockResolvedValue(SERVICES);
  prismaMock.service.count.mockResolvedValue(SERVICES.length);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeAdminSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.paginatedGetServices({
    page: 1,
    perPage: 10,
  });

  expect(result).toMatchObject({
    total: SERVICES.length,
    page: 1,
    perPage: 10,
    data: SERVICES,
  });
});

test("getServicesByName test", async () => {
  const mockServices = SERVICES.filter((service) =>
    service.name.toLowerCase().includes("fence")
  );

  prismaMock.service.findMany.mockResolvedValue(mockServices);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.getServicesByName("fence");

  expect(result).toMatchObject(mockServices);
});

test("getUserProvidedServices test", async () => {
  type Output = inferProcedureOutput<
    AppRouter["services"]["getUserProvidedServices"]
  >;

  const mockUser: Output = { ...fakeUser, providedServices: SERVICES };
  prismaMock.user.findUnique.mockResolvedValue(mockUser);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeUserSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.getUserProvidedServices();

  expect(result).toMatchObject(mockUser);
});

test("createNewService test", async () => {
  type Output = inferProcedureOutput<AppRouter["services"]["createNewService"]>;

  const mockService: Output = {
    description: "Test service",
    name: "Test Service",
    rate: 123,
  };
  prismaMock.service.create.mockResolvedValue(mockService);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeAdminSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.createNewService({
    description: "Test service",
    name: "Test Service",
    rate: 123,
  });

  expect(result).toMatchObject(mockService);
});

test("updateService test", async () => {
  type Output = inferProcedureOutput<AppRouter["services"]["updateService"]>;

  const mockService: Output = {
    description: "Test service",
    name: "Test Service",
    rate: 123,
  };
  prismaMock.service.update.mockResolvedValue(mockService);

  const caller = appRouter.createCaller(
    createInnerTRPCContext({
      session: fakeAdminSession,
      prisma: prismaMock,
    })
  );

  const result = await caller.services.updateService({
    description: "Test service",
    name: "Test Service",
    rate: 123,
  });

  expect(result).toMatchObject(mockService);
});
