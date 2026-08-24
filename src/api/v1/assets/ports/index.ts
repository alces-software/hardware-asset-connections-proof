import { OpenAPIHono } from '@hono/zod-openapi';
import getPortByID from './controllers/getPortByID';
import getAllPorts from './controllers/getAllPorts';
import deletePort from './controllers/deletePort';
import createPort from './controllers/createPort';
import updatePort from './controllers/updatePort';

export default new OpenAPIHono()
   .route('/:portid', getPortByID)
   .route('/:portid', deletePort)
   .route('/:portid', updatePort)
   .route('/', createPort)
   .route('/', getAllPorts);
