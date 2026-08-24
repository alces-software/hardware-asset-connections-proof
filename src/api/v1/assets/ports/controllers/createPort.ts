import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { internalServerError, notFoundError } from '../../../../../lib/errorMessages';
import { serializePort } from '../lib/outputSerializers';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../../lib/openApiSchemas';
import { PortSchema } from '../lib/schemas';
import { createPort, isValidPortType } from '../lib/helpers';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'post',
      path: '/',
      description: 'Creates a new port on an asset',
      tags: ['Assets', 'Ports'],
      request: {
         params: z.object({
            ...createIdParam('id')
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
         201: {
            description: 'Port created',
            content: {
               'application/json': {
                  schema: PortSchema
               }
            }
         },
         ...InternalServerErrorSchema,
         ...NotFoundErrorSchema
      }
   }),
   async (c) => {
      try {
         const { id } = c.req.valid('param');

         const body = c.req.valid('json');

         if (!(await isValidPortType(body.portTypeId))) {
            return notFoundError(c, `PortType with id: ${body.portTypeId} could not be found.`);
         }

         const port = await createPort(id, body.portTypeId);

         if (!port) {
            return notFoundError(c, `Asset with id: ${id} could not be found.`);
         }

         return c.json(serializePort(port), 201);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
