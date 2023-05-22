import { MembershipType } from "@prisma/client";

export const COMMISSION = 0.2;
export const TRADIE_MEMBERSHIP = {
  price: 80,
  duration: 365,
  type: MembershipType.PROVIDER,
};

export const CLIENT_MEMBERSHIP = {
  price: 120,
  duration: 365,
  type: MembershipType.CLIENT,
};
