import { CLIENT_MEMBERSHIP, TRADIE_MEMBERSHIP } from "@/constant";
import { SERVICES } from "@/fakes/fakeServices";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
  const services = await prisma.service.createMany({ data: SERVICES });
  const memberships = await prisma.membership.createMany({
    data: [TRADIE_MEMBERSHIP, CLIENT_MEMBERSHIP],
  });
  console.log("Services seeded", services);
  console.log("Memberships seeded", memberships);
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
