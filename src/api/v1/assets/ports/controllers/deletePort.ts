import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../../lib/errorMessages';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../../lib/openApiSchemas';
import { assetExists } from '../lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'delete',
      path: '/',
      description: 'Deletes a port',
      tags: ['Assets', 'Ports'],
      request: {
         params: z.object({
            ...createIdParam('id'),
            ...createIdParam('portid')
         })
      },
      responses: {
         204: {
            description: 'Port deleted'
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         const { id, portid } = c.req.valid('param');

         if (!(await assetExists(id))) {
            return notFoundError(c, `Asset with id: ${id} could not be found`);
         }

         const port = await prisma.ports.findUnique({
            where: {
               id: portid,
               assetId: id
            }
         });

         if (!port) {
            return notFoundError(c, `Port with id ${portid} could not be found on this asset`);
         }

         await prisma.ports.delete({
            where: {
               id: portid
            }
         });

         return c.body(null, 204);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
