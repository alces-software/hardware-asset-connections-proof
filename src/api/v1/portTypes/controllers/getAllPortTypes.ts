import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError } from '../../../../lib/errorMessages';
import { portTypeInclude } from '../lib/includes';
import { serializePortType } from '../lib/serializers';
import { InternalServerErrorSchema } from '../../../../lib/openApiSchemas';
import { PortTypeSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Retrieves all the port types',
      tags: ['Port Types'],
      responses: {
         200: {
            description: 'Port types retrieved',
            content: {
               'application/json': {
                  schema: z.array(PortTypeSchema)
               }
            }
         },
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         const portTypes = await prisma.portTypes.findMany({
            ...portTypeInclude
         });

         return c.json(portTypes.map(serializePortType), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
