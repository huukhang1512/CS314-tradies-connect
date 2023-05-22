import { prisma } from "@/server/db"

export const getUserRating = async (userId: string): Promise<number> => {
  // aggregate rating from reviews
  const aggr = await prisma.review.aggregate({
    where: {
      recipientId: userId,
    },
    _avg: {
      rating: true,
    },
  });
  return aggr._avg.rating || 0;

}