import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError, notFoundError } from '../../../../lib/errorMessages';
import { assetInclude } from '../lib/includes';
import { serializeAsset } from '../lib/serializers';
import {
   createIdParam,
   InternalServerErrorSchema,
   NotFoundErrorSchema
} from '../../../../lib/openApiSchemas';
import { AssetSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: "Retrieves an asset using it's ID",
      tags: ['Assets'],
      request: {
         params: z.object({
            ...createIdParam('id')
         })
      },
      responses: {
         200: {
            description: 'Asset retrieved',
            content: {
               'application/json': {
                  schema: AssetSchema
               }
            }
         },
         ...NotFoundErrorSchema,
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         // Get request information
         const { id } = c.req.valid('param');

         // Try and get the asset from the database
         const asset = await prisma.assets.findUnique({
            where: {
               id
            },
            ...assetInclude
         });

         // Check the asset exists
         if (!asset) {
            return notFoundError(c, `Asset with id: ${id} could not be found.`);
         }

         return c.json(serializeAsset(asset), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
