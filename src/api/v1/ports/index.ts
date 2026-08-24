import { OpenAPIHono } from '@hono/zod-openapi';
import connect from './controllers/connect';
import disconnect from './controllers/disconnect';

export default new OpenAPIHono().route('/connect', connect).route('/disconnect', disconnect);
