import { OpenAPIHono } from '@hono/zod-openapi';
import getPortByID from './controllers/getPortByID';
import getAllPorts from './controllers/getAllPorts';

export default new OpenAPIHono().route('/:portid', getPortByID).route('/', getAllPorts);
