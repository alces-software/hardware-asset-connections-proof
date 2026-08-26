import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../lib/errorMessages';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';
import { PortTypeSchema } from '../lib/schemas';
import { portTypeInclude } from '../lib/includes';
import { serializePortType } from '../lib/serializers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Retrieves a port type using its ID',
      tags: ['Port Types'],
      request: {
         params: z.object({
            ...createIdParam('id')
         })
      },
      responses: {
         200: {
            description: 'Port type retrieved',
            content: {
               'application/json': {
                  schema: PortTypeSchema
               }
            }
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
            },
            ...portTypeInclude
         });

         if (!portType) {
            return notFoundError(c, `Port type with id: ${id} could not be found.`);
         }

         return c.json(serializePortType(portType), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
