import { OpenAPIHono } from '@hono/zod-openapi';
import getAssetByID from './controllers/getAssetByID';
import updateAsset from './controllers/updateAsset';
import deleteAsset from './controllers/deleteAsset';
import getAllAssets from './controllers/getAllAssets';
import createAsset from './controllers/createAsset';
import ports from './ports';

export default new OpenAPIHono()
   .route('/:id/ports', ports)
   .route('/:id', getAssetByID)
   .route('/:id', updateAsset)
   .route('/:id', deleteAsset)
   .route('/', getAllAssets)
   .route('/', createAsset);
