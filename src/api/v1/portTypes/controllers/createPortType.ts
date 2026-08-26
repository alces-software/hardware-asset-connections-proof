import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { existingResourceError, internalServerError } from '../../../../lib/errorMessages';
import { portTypeInclude } from '../lib/includes';
import { serializePortType } from '../lib/serializers';
import { ConflictErrorSchema, InternalServerErrorSchema } from '../../../../lib/openApiSchemas';
import { PortTypeSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'post',
      path: '/',
      description: 'Creates a new port type',
      tags: ['Port Types'],
      request: {
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
         201: {
            description: 'Port type created',
            content: {
               'application/json': {
                  schema: PortTypeSchema
               }
            }
         },
         ...InternalServerErrorSchema,
         ...ConflictErrorSchema
      }
   }),
   async (c) => {
      try {
         const body = c.req.valid('json');

         const existingName = await prisma.portTypes.findFirst({
            where: {
               name: body.name
            }
         });

         if (existingName) {
            return existingResourceError(
               c,
               `A port type called: ${body.name} already exists in the database`
            );
         }

         const portType = await prisma.portTypes.create({
            data: {
               name: body.name
            },
            ...portTypeInclude
         });

         return c.json(serializePortType(portType), 201);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
