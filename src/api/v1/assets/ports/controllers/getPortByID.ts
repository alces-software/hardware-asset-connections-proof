import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../../lib/errorMessages';
import { portInclude } from '../lib/includeSerializers';
import { serializePort } from '../lib/outputSerializers';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../../lib/openApiSchemas';
import { PortSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: "Retrieves a port and it's connections using it's ID",
      tags: ['Assets', 'Ports'],
      request: {
         params: z.object({
            ...createIdParam('id'),
            ...createIdParam('portid')
         })
      },
      responses: {
         200: {
            description: 'Port retrieved',
            content: {
               'application/json': {
                  schema: PortSchema
               }
            }
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         const { id, portid } = c.req.valid('param');

         const asset = await prisma.assets.findUnique({
            where: {
               id
            }
         });

         // Check the asset exists
         if (!asset) {
            return notFoundError(c, `Asset with id: ${id} could not be found.`);
         }

         const port = await prisma.ports.findUnique({
            where: {
               id: portid,
               assetId: id
            },
            ...portInclude
         });

         if (!port) {
            return notFoundError(c, `Port with id: ${portid} could not be found.`);
         }

         return c.json(serializePort(port), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
