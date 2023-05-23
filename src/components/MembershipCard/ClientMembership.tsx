import { useState } from "react";
import { PaymentPopup } from "../PaymentPopup";
import { api } from "@/utils/api";
import { type UserMembership, type Membership } from "@prisma/client";
import { BaseMembershipCard } from "./BaseMembershipCard";
import { useRouter } from "next/router";

export const ClientMembership = ({
  activeMemberships,
}: {
  activeMemberships: UserMembership[];
}) => {
  const router = useRouter();
  const [isPurchasingPopup, setIsPurchasingPopup] = useState(false);
  const [chosenMembership, setChosenMembership] = useState<Membership>();
  const { data: membershipData, isLoading: isLoadingMembership } =
    api.memberships.getClientMemberships.useQuery();
  const { isLoading: isSubscribing, mutateAsync } =
    api.memberships.subscribeToMembership.useMutation();

  const handlePurchaseClick = (membership: Membership) => {
    setIsPurchasingPopup(true);
    setChosenMembership(membership);
  };

  const subscribeToMembership = async () => {
    await mutateAsync({ membershipId: chosenMembership?.id || "" });
    await router.push("/app/client");
  };

  if (isLoadingMembership) return <>Loading...</>;
  return (
    <>
      <PaymentPopup
        isLoading={isSubscribing}
        isOpen={isPurchasingPopup}
        onClose={() => setIsPurchasingPopup(false)}
        onSubmit={subscribeToMembership}
        total={chosenMembership?.price || 0}
      />
      {membershipData?.map((membership: Membership) => (
        <BaseMembershipCard
          membership={membership}
          key={membership.id}
          hasPurchased={
            !!activeMemberships?.some(
              (activeMembership) =>
                activeMembership.membershipId === membership.id
            )
          }
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
