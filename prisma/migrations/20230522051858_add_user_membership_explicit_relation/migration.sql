/*
  Warnings:

  - You are about to drop the `_MembershipToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MembershipToUser" DROP CONSTRAINT "_MembershipToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MembershipToUser" DROP CONSTRAINT "_MembershipToUser_B_fkey";

-- DropTable
DROP TABLE "_MembershipToUser";

-- CreateTable
CREATE TABLE "UserMembership" (
    "userId" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiredAt" TIMESTAMP(3),

    CONSTRAINT "UserMembership_pkey" PRIMARY KEY ("userId","membershipId")
);

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMembership" ADD CONSTRAINT "UserMembership_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "Membership"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
