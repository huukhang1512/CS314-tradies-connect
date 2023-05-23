import { faker } from "@faker-js/faker";
import {
  type Request,
  RequestStatus,
  type User,
  type Service,
} from "@prisma/client";

export const generateFakeRequestsFromUsersAndServices = (
  users: User[],
  services: Service[]
): Request[] => {
  return users.map((user) => {
    const randomUnit = faker.number.int({ min: 1, max: 10 });
    const randomService: Service | undefined =
      services[faker.number.int({ min: 0, max: services.length - 1 })];
    return {
      id: faker.string.uuid(),
      clientId: user.id,
      createdAt: new Date(),
      description: faker.lorem.sentence(),
      status: RequestStatus.BROADCASTED,
      serviceName: randomService?.name || "",
      price: randomUnit * (randomService?.rate || 1),
      unit: randomUnit,
    };
  });
};
