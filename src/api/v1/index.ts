import { OpenAPIHono } from '@hono/zod-openapi';

import assets from './assets';
import ports from './ports';
import portTypes from './portTypes';

export default new OpenAPIHono()
   .route('/assets', assets)
   .route('/ports', ports)
   .route('/portTypes', portTypes);
