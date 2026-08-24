import { OpenAPIHono } from '@hono/zod-openapi';

import assets from './assets';
import ports from './ports';

export default new OpenAPIHono().route('/assets', assets).route('/ports', ports);
