import { useState } from "react";
import { PaymentPopup } from "../PaymentPopup";
import { api } from "@/utils/api";
import { type Membership } from "@prisma/client";
import { BaseMembershipCard } from "./BaseMembershipCard";

export const ClientMembership = () => {
  const [isPurchasingPopup, setIsPurchasingPopup] = useState(false);
  const [chosenMembership, setChosenMembership] = useState<Membership>();
  const { data: userData, isLoading: isLoadingUserData } =
    api.users.me.useQuery();
  const { data: membershipData, isLoading: isLoadingMembership } =
    api.memberships.getClientMemberships.useQuery();
  const { mutateAsync } = api.memberships.subscribeToMembership.useMutation();

  const handlePurchaseClick = (membership: Membership) => {
    setIsPurchasingPopup(true);
    setChosenMembership(membership);
  };

  const subscribeToMembership = async () => {
    await mutateAsync({ membershipId: chosenMembership?.id || "" });
    setIsPurchasingPopup(false);
  };

  const hasPurchased = (membershipId: string) =>
    !!userData?.memberships.map((mem) => mem.id).includes(membershipId);

  if (isLoadingMembership || isLoadingUserData) return <>Loading...</>;
  return (
    <>
      <PaymentPopup
        isOpen={isPurchasingPopup}
        onClose={() => setIsPurchasingPopup(false)}
        onSubmit={subscribeToMembership}
        total={chosenMembership?.price || 0}
      />
      {membershipData?.map((membership: Membership) => (
        <BaseMembershipCard
          membership={membership}
          key={membership.id}
          hasPurchased={hasPurchased(membership.id)}
          onPurchase={handlePurchaseClick}
          features={[
            "Fixed membership fee annually",
            "Unlimited assistance callouts",
          ]}
        />
      ))}
    </>
  );
};
