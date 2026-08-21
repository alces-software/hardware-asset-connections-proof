import { z } from '@hono/zod-openapi';

export const PortTypeSchema = z.object({
   id: z.number(),
   name: z.string()
});

export const ConnectedPortSchema = z.object({
   id: z.number(),
   assetId: z.number(),
   portIndex: z.number(),
   portType: PortTypeSchema
});

export const PortSchema = z.object({
   id: z.number(),
   portIndex: z.number(),
   portType: PortTypeSchema
});
