import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../lib/errorMessages';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'delete',
      path: '/',
      description: 'Deletes a port type',
      tags: ['Port Types'],
      request: {
         params: z.object({
            ...createIdParam('id')
         })
      },
      responses: {
         204: {
            description: 'Port type deleted'
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         const { id } = c.req.valid('param');

         const portType = await prisma.portTypes.findUnique({
            where: {
               id
            }
         });

         if (!portType) {
            return notFoundError(c, `Port with id: ${id} could not be found.`);
         }

         await prisma.portTypes.delete({
            where: {
               id
            }
         });

         return c.body(null, 204);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
