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
      description: 'Disconnects two ports',
      tags: ['Ports'],
      request: {
         body: {
            content: {
               'application/json': {
                  schema: z.object({
                     ...createIdParam('portAId'),
                     ...createIdParam('portBId')
                  })
               }
            }
         }
      },
      responses: {
         204: {
            description: 'Ports disconnected'
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const { portAId, portBId } = c.req.valid('json');

      const [id1, id2] = [portAId, portBId].sort((a, b) => a - b);

      try {
         const connection = await prisma.portConnections.findUnique({
            where: {
               PortAId_PortBId: {
                  PortAId: id1,
                  PortBId: id2
               }
            }
         });

         if (!connection) {
            return notFoundError(c, 'No connection exists between these ports');
         }

         await prisma.portConnections.delete({
            where: {
               id: connection.id
            }
         });

         return c.body(null, 204);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
