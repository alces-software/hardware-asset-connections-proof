import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import {
   existingResourceError,
   internalServerError,
   notFoundError
} from '../../../../lib/errorMessages';
import { portTypeInclude } from '../lib/includes';
import { serializePortType } from '../lib/serializers';
import {
   ConflictErrorSchema,
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';
import { PortTypeSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'patch',
      path: '/',
      description: 'Updates a port type',
      tags: ['Port Types'],
      request: {
         params: z.object({
            ...createIdParam('id')
         }),
         body: {
            content: {
               'application/json': {
                  schema: z.object({
                     name: z
                        .string({ error: 'Name must be a string' })
                        .min(1, { error: 'Name cannot be empty' })
                  })
               }
            }
         }
      },
      responses: {
         200: {
            description: 'Port type updated',
            content: {
               'application/json': {
                  schema: PortTypeSchema
               }
            }
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema,
         ...ConflictErrorSchema
      }
   }),
   async (c) => {
      try {
         const { id } = c.req.valid('param');
         const body = c.req.valid('json');

         const existingPortType = await prisma.portTypes.findUnique({
            where: { id },
            select: { id: true }
         });

         if (!existingPortType) {
            return notFoundError(c, `Port type with id: ${id}, could not be found.`);
         }

         const existingPortTypeName = await prisma.portTypes.findMany({
            where: { name: body.name },
            select: { id: true }
         });

         if (existingPortTypeName) {
            return existingResourceError(c, `Port type with name: ${body.name} already exists.`);
         }

         const portType = await prisma.portTypes.update({
            where: { id },
            data: {
               name: body.name
            },
            ...portTypeInclude
         });

         return c.json(serializePortType(portType), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
