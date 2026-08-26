import { OpenAPIHono } from '@hono/zod-openapi';
import deletePortType from './controllers/deletePortType';
import createPortType from './controllers/createPortType';
import getAllPortTypes from './controllers/getAllPortTypes';
import getPortTypebyID from './controllers/getPortTypebyID';
import updatePortType from './controllers/updatePortType';

export default new OpenAPIHono()
   .route('/:id', deletePortType)
   .route('/:id', getPortTypebyID)
   .route('/:id', updatePortType)
   .route('/', createPortType)
   .route('/', getAllPortTypes);
