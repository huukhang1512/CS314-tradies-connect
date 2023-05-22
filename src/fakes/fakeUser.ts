import { Role, type User } from "@prisma/client";
import { type Session } from "next-auth";

export const fakeUser: User = {
  id: "test-user-id",
  name: null,
  email: null,
  emailVerified: null,
  image: null,
  address: null,
  lat: null,
  lng: null,
  role: Role.USER,
  createdAt: new Date(),
  phoneNumber: null,
};

export const fakeAdmin: User = {
  id: "test-admin-id",
  name: null,
  email: null,
  emailVerified: null,
  image: null,
  address: null,
  lat: null,
  lng: null,
  role: Role.ADMIN,
  createdAt: new Date(),
  phoneNumber: null,
};

export const fakeAdminSession: Session = {
  expires: new Date().toISOString(),
  user: fakeAdmin,
};

export const fakeUserSession: Session = {
  expires: new Date().toISOString(),
  user: fakeUser,
};
