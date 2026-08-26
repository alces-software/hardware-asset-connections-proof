import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { prisma } from '../../../../lib/prisma';
import { internalServerError } from '../../../../lib/errorMessages';
import { assetInclude } from '../lib/includes';
import { serializeAsset } from '../lib/serializers';
import { InternalServerErrorSchema } from '../../../../lib/openApiSchemas';
import { AssetSchema } from '../lib/schemas';

export default new OpenAPIHono().openapi(
   createRoute({
      method: 'get',
      path: '/',
      description: 'Retrieves all the assets',
      tags: ['Assets'],
      responses: {
         200: {
            description: 'Assets retrieved',
            content: {
               'application/json': {
                  schema: z.array(AssetSchema)
               }
            }
         },
         ...InternalServerErrorSchema
      }
   }),
   async (c) => {
      try {
         const assets = await prisma.assets.findMany({
            ...assetInclude
         });

         return c.json(assets.map(serializeAsset), 200);
      } catch (err) {
         return internalServerError(c, err);
      }
   }
);
