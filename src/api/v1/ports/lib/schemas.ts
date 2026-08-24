import { z } from '@hono/zod-openapi';

export const ConnectionSchema = z.object({
   portAId: z.number(),
   portBId: z.number()
});
