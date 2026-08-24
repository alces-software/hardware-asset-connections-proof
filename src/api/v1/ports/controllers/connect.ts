import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../lib/errorMessages';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';

import { ConnectionSchema } from '../lib/schemas';

const ConflictErrorSchema = z.object({
   error: z.string()
});

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'post',
      path: '/',
      description: 'Connects two ports together',
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
         201: {
            description: 'Connection created',
            content: {
               'application/json': {
                  schema: ConnectionSchema
               }
            }
         },
         409: {
            description: 'Both ports are already connected',
            content: {
               'application/json': {
                  schema: ConflictErrorSchema
               }
            }
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      const { portAId, portBId } = c.req.valid('json');

      const [id1, id2] = [portAId, portBId].sort((a, b) => a - b);

      try {
         const ports = await prisma.ports.findMany({
            where: {
               id: {
                  in: [id1, id2]
               }
            }
         });

         if (ports.length !== 2) {
            return notFoundError(c, 'One or both ports not found');
         }

         const existingConnections = await prisma.portConnections.findMany({
            where: {
               OR: [{ PortAId: id1 }, { PortBId: id1 }, { PortAId: id2 }, { PortBId: id2 }]
            }
         });

         const port1Connected = existingConnections.some(
            (connection) => connection.PortAId === id1 || connection.PortBId === id1
         );

         const port2Connected = existingConnections.some(
            (connection) => connection.PortAId === id2 || connection.PortBId === id2
         );

         if (port1Connected && port2Connected) {
            return c.json(
               {
                  error: 'Both ports are already connected'
               },
               409
            );
         }

         const connection = await prisma.portConnections.create({
            data: {
               PortAId: id1,
               PortBId: id2
            }
         });

         return c.json(
            {
               portAId: connection.PortAId,
               portBId: connection.PortBId
            },
            201
         );
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
