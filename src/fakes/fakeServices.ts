import { type Service } from "@prisma/client";

export const SERVICES: Service[] = [
  {
    name: "Tree Pruning",
    rate: 100,
    description: "How many tree do you want to prune?",
    unit: "Tree",
  },
  {
    name: "Tree Removal",
    rate: 1000,
    description: "How many tree do you want to remove?",
    unit: "Tree",
  },
  {
    name: "Tree Planting",
    rate: 150,
    description: "How many tree do you want to plant?",
    unit: "Tree",
  },
  {
    name: "Roof Cleaning",
    rate: 50,
    description: "How big is your roof in square meter?",
    unit: "Square Meter",
  },
  {
    name: "Fence Installation",
    rate: 1200,
    description: "How long do you want to install your fence in meters?",
    unit: "Meter",
  },
  {
    name: "Oven Repair",
    rate: 300,
    description: "How many oven do you want to repair",
    unit: "Oven",
  },
];
