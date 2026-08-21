import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { prisma } from '../../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../../lib/errorMessages';
import { portInclude } from '../lib/includeSerializers';
import { serializePort } from '../lib/outputSerializers';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../../lib/openApiSchemas';
import { PortSchema } from '../lib/schemas';
import { assetExists } from '../lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Retrieves all ports on an asset',
      tags: ['Assets', 'Ports'],
      request: {
         params: z.object({
            ...createIdParam('id')
         })
      },
      responses: {
         200: {
            description: 'Ports retrieved',
            content: {
               'application/json': {
                  schema: z.array(PortSchema)
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

         if (!(await assetExists(id))) {
            return notFoundError(c, `Asset with id: ${id}, could not be found`);
         }

         const ports = await prisma.ports.findMany({
            where: {
               assetId: id
            },
            ...portInclude
         });

         return c.json(ports.map(serializePort), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
