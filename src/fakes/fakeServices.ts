import { type Service } from "@prisma/client";

export const SERVICES: Service[] = [
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
