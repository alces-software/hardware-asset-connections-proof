import { z } from '@hono/zod-openapi';
import { PortSchema } from '../ports/lib/schemas';

export const AssetSchema = z.object({
   id: z.number(),
   name: z.string(),
   notes: z.string().nullable(),
   uSize: z.number(),
   uTop: z.number(),
   uBottom: z.number(),
   ports: z.array(PortSchema)
});
