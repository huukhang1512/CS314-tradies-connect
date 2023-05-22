import { z } from "zod";

export const PaginatedInput = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(10),
});
