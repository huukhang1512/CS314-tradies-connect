/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import AvatarMenuButton from "../AvatarMenuButton";
import { Menu } from "@chakra-ui/react";
jest.mock("next-auth/react", () => {
  // disable rule here for testing purposes
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const originalModule = jest.requireActual("next-auth/react");
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" },
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
    }),
  };
});

describe("<AvatarMenuButton/> Test", () => {
  it("Matches DOM Snapshot", () => {
    const { container } = render(
      <Menu>
        <AvatarMenuButton />
      </Menu>
    );
    expect(container).toMatchSnapshot();
  });
});
