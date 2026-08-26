import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../../lib/errorMessages';
import { portInclude } from '../lib/includes';
import { serializePort } from '../lib/serializers';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../../lib/openApiSchemas';
import { PortSchema } from '../lib/schemas';
import { assetExists } from '../lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'patch',
      path: '/',
      description: 'Updates a port',
      tags: ['Assets', 'Ports'],
      request: {
         params: z.object({
            ...createIdParam('id'),
            ...createIdParam('portid')
         }),
         body: {
            content: {
               'application/json': {
                  schema: z.object({
                     ...createIdParam('portTypeId')
                  })
               }
            }
         }
      },
      responses: {
         200: {
            description: 'Port updated',
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
         const { portTypeId } = c.req.valid('json');

         if (!(await assetExists(id))) {
            return notFoundError(c, `Asset with id: ${id}, could not be found`);
         }

         const port = await prisma.ports.findFirst({
            where: {
               id: portid,
               assetId: id
            }
         });

         if (!port) {
            return notFoundError(c, `Port with id: ${portid}, could not be found`);
         }

         const updatedPort = await prisma.ports.update({
            where: {
               id: portid
            },
            data: {
               portTypeId
            },
            ...portInclude
         });

         return c.json(serializePort(updatedPort), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
