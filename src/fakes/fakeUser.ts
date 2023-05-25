import { Role, type User } from "@prisma/client";
import { type Session } from "next-auth";
import { faker } from "@faker-js/faker";
import { reverseGeocode } from "@/utils/location/locationService";

const SYDNEY_CBD_COORDINATE: [latitude: number, longitude: number] = [
  -33.8675, 151.207,
];

export const createFakeUsers = async (n: number): Promise<User[]> => {
  const res: User[] = [];
  for (let i = 0; i < n; i++) {
    const [lat, lng] = faker.location.nearbyGPSCoordinate({
      radius: 20, // within 20KM from Sydney CBD
      origin: SYDNEY_CBD_COORDINATE,
    });
    const location = await reverseGeocode(lat, lng);
    res.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      emailVerified: null,
      image: faker.internet.avatar(),
      address: location.display_name,
      lat: lat.toString(),
      lng: lng.toString(),
      role: Role.USER,
      createdAt: new Date(),
      phoneNumber: faker.phone.number(),
    });
  }
  return res;
};

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
