import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import {
   existingResourceError,
   internalServerError,
   notFoundError
} from '../../../../lib/errorMessages';
import {
   ConflictErrorSchema,
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';

import { ConnectionSchema } from '../lib/schemas';
import { portInclude } from '../../lib/includes';
import { combineConnections } from '../../lib/serializers';

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
         ...ConflictErrorSchema,
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
            },
            ...portInclude
         });

         if (ports.length !== 2) {
            return notFoundError(c, 'One or both ports not found');
         }

         // Get connections of ports
         const serializedPorts = ports.map((port) => {
            const connectedPorts = combineConnections(port);
            return {
               id: port.id,
               connectedPorts: connectedPorts.map((connectedPort) => ({ id: connectedPort.id }))
            };
         });

         // Don't create connection if both ports already have a connection (prevent's daisy chaining)
         if (
            serializedPorts[0].connectedPorts.length > 0 &&
            serializedPorts[1].connectedPorts.length > 0
         ) {
            return existingResourceError(c, 'Both ports already have connections');
         }

         // For both ports, check if they have just one connection, and then check if the port it's connected to has a connection
         for (const port of serializedPorts) {
            if (port.connectedPorts.length !== 1) {
               continue;
            }

            const connectedPort = await prisma.ports.findUnique({
               where: {
                  id: port.connectedPorts[0].id
               },
               ...portInclude
            });

            if (!connectedPort) {
               throw new Error("I don't know how you managed this");
            }

            const connectedPortPorts = combineConnections(connectedPort);

            if (connectedPortPorts.length > 1) {
               return existingResourceError(c, 'This would create a daisy chain');
            }
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
