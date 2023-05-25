/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import { BaseMembershipCard } from "../MembershipCard/BaseMembershipCard";
import { CLIENT_MEMBERSHIP } from "@/constant";

describe("Base Membership Card", () => {
  it("Matches DOM Snapshot", () => {
    const { container } = render(
      <BaseMembershipCard
        hasPurchased={true}
        membership={{
          ...CLIENT_MEMBERSHIP,
          createdAt: new Date(),
          id: "test-membership-id",
        }}
        isLoading={false}
        onCancel={async () => await new Promise(() => console.log("void"))}
        onPurchase={() => console.log("void")}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
