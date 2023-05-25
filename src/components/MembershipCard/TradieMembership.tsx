import { PaymentPopup } from "../PaymentPopup";
import { useState } from "react";
import { api } from "@/utils/api";
import { type UserMembership, type Membership } from "@prisma/client";
import { BaseMembershipCard } from "./BaseMembershipCard";
import { useRouter } from "next/router";

export const TradieMembership = ({
  activeMemberships,
  refetch,
}: {
  activeMemberships: UserMembership[];
  refetch: () => Promise<unknown>;
}) => {
  const router = useRouter();
  const [isPurchasingPopup, setIsPurchasingPopup] = useState(false);
  const [chosenMembership, setChosenMembership] = useState<Membership>();
  const { data: membershipData, isLoading: isLoadingMembership } =
    api.memberships.getTradieMemberships.useQuery();
  const { mutateAsync: subscribe, isLoading: isSubcribing } =
    api.memberships.subscribeToMembership.useMutation();
  const { mutateAsync: cancel, isLoading: isCancelling } =
    api.memberships.cancelMembership.useMutation();

  const handlePurchaseClick = (membership: Membership) => {
    if (
      activeMemberships?.some(
        (activeMembership) =>
          activeMembership.membershipId === membership.id &&
          !activeMembership.isAutoRenew
      )
    ) {
      void subscribeToMembership(membership);
      return;
    }
    setIsPurchasingPopup(true);
    setChosenMembership(membership);
  };

  const subscribeToMembership = async (membership: Membership) => {
    await subscribe({ membershipId: membership.id });
    await router.push("/app/tradie");
  };

  const cancelMembership = async (membership: Membership) => {
    await cancel({ membershipId: membership.id });
    await refetch();
  };

  if (isLoadingMembership) return <>Loading...</>;
  return (
    <>
      {chosenMembership && (
        <PaymentPopup
          isOpen={isPurchasingPopup}
          onClose={() => setIsPurchasingPopup(false)}
          onSubmit={() => subscribeToMembership(chosenMembership)}
          total={chosenMembership?.price}
        />
      )}
      {membershipData?.map((membership: Membership) => (
        <BaseMembershipCard
          membership={membership}
          key={membership.id}
          hasPurchased={
            !!activeMemberships?.some(
              (activeMembership) =>
                activeMembership.membershipId === membership.id &&
                activeMembership.isAutoRenew
            )
          }
          onPurchase={handlePurchaseClick}
          onCancel={cancelMembership}
          features={["Fixed membership fee annually"]}
          isLoading={isSubcribing || isCancelling}
        />
      ))}
    </>
  );
};
