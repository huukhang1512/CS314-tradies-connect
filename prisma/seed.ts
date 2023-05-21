import { CLIENT_MEMBERSHIP, TRADIE_MEMBERSHIP } from "@/constant";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const SERVICES = [
  {
    name: "Tree Pruning",
    rate: 100,
    description: "Pruning your tree",
  },
  {
    name: "Tree Removal",
    rate: 1000,
    description: "Removing your tree",
  },
  {
    name: "Tree Planting",
    rate: 150,
    description: "Plant a tree for you",
  },
  {
    name: "Roof Cleaning",
    rate: 50,
    description: "Cleaning your roof",
  },
  {
    name: "Fence Installation",
    rate: 1200,
    description: "Add a fence for you",
  },
  {
    name: "Oven Repair",
    rate: 300,
    description: "Repair your oven",
  },
];

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
