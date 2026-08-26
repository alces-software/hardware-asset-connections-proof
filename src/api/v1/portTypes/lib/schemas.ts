import { z } from '@hono/zod-openapi';

export const PortTypeSchema = z.object({
   id: z.number(),
   name: z.string()
});
