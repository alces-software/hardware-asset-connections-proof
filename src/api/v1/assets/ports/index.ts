import { OpenAPIHono } from '@hono/zod-openapi';
import getPortByID from './controllers/getPortByID';
import getAllPorts from './controllers/getAllPorts';
import deletePort from './controllers/deletePort';

export default new OpenAPIHono()
   .route('/:portid', getPortByID)
   .route('/:portid', deletePort)
   .route('/', getAllPorts);
