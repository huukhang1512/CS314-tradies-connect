import { CLIENT_MEMBERSHIP, TRADIE_MEMBERSHIP } from "@/constant";
import { generateFakeRequestsFromUsersAndServices } from "@/fakes/fakeRequest";
import { SERVICES } from "@/fakes/fakeServices";
import { createFakeUsers } from "@/fakes/fakeUser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const fakeUsers = await createFakeUsers(30);
  const fakeRequests = generateFakeRequestsFromUsersAndServices(
    fakeUsers,
    SERVICES
  );
  const [users, services, memberships, requests] = await Promise.all([
    await prisma.user.createMany({ data: fakeUsers }),
    await prisma.service.createMany({ data: SERVICES }),
    await prisma.membership.createMany({
      data: [TRADIE_MEMBERSHIP, CLIENT_MEMBERSHIP],
    }),
    await prisma.request.createMany({
      data: fakeRequests,
    }),
  ]);

  console.log("Users seeded", users);
  console.log("Services seeded", services);
  console.log("Memberships seeded", memberships);
  console.log("Requests seeded", requests);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
