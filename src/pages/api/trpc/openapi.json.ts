import { type NextApiRequest, type NextApiResponse } from "next";

import { openApiDocument } from "./[trpc]";

// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default handler;
