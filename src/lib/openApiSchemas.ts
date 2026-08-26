import { z } from '@hono/zod-openapi';

/**
 * The openAPI docs for an bad request error
 */
export const BadRequestErrorSchema = {
   400: {
      description: 'Invalid request',
      content: {
         'application/json': {
            schema: z.object({
               error: z.string(),
               message: z.string().optional(),
               details: z.unknown().optional()
            })
         }
      }
   }
};

/**
 * The openAPI docs for a not found error
 */
export const NotFoundErrorSchema = {
   404: {
      description: 'Resource not found',
      content: {
         'application/json': {
            schema: z.object({
               error: z.string(),
               message: z.string()
            })
         }
      }
   }
};

/**
 * The openAPI docs for an conflict error
 */
export const ConflictErrorSchema = {
   409: {
      description: 'Resource already exists',
      content: {
         'application/json': {
            schema: z.object({
               error: z.string(),
               message: z.string()
            })
         }
      }
   }
};

/**
 * The openAPI docs for an internal server error
 */
export const InternalServerErrorSchema = {
   500: {
      description: 'Internal server error',
      content: {
         'application/json': {
            schema: z.object({
               error: z.string(),
               message: z.string()
            })
         }
      }
   }
};

export const createIdParam = (name: string) => ({
   [name]: z.coerce
      .number({ error: `${name} must be a number` })
      .int({ error: `${name} must be an integer` })
      .positive({ error: `${name} must be greater than 0` })
});
