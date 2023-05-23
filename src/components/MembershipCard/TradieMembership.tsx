import { PaymentPopup } from "../PaymentPopup";
import { TRADIE_MEMBERSHIP } from "@/constant";
import { useState } from "react";
import { api } from "@/utils/api";
import { type UserMembership, type Membership } from "@prisma/client";
import { BaseMembershipCard } from "./BaseMembershipCard";
import { useRouter } from "next/router";

export const TradieMembership = ({
  activeMemberships,
}: {
  activeMemberships: UserMembership[];
}) => {
  const router = useRouter();
  const [isPurchasingPopup, setIsPurchasingPopup] = useState(false);
  const [chosenMembership, setChosenMembership] = useState<Membership>();
  const { data: membershipData, isLoading: isLoadingMembership } =
    api.memberships.getTradieMemberships.useQuery();
  const { isLoading: isSubscribing, mutateAsync } =
    api.memberships.subscribeToMembership.useMutation();

  const handlePurchaseClick = (membership: Membership) => {
    setIsPurchasingPopup(true);
    setChosenMembership(membership);
  };

  const subscribeToMembership = async () => {
    await mutateAsync({ membershipId: chosenMembership?.id || "" });
    await router.push("/app/tradie");
  };

  if (isLoadingMembership) return <>Loading...</>;
  return (
    <>
      <PaymentPopup
        isLoading={isSubscribing}
        isOpen={isPurchasingPopup}
        onClose={() => setIsPurchasingPopup(false)}
        onSubmit={subscribeToMembership}
        total={TRADIE_MEMBERSHIP.price}
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
          features={["Fixed membership fee annually"]}
        />
      ))}
    </>
  );
};
