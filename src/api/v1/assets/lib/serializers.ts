import { Prisma } from '@prisma/client';
import { assetInclude } from './includes';
import { serializePort } from '../ports/lib/serializers';

export function serializeAsset(asset: Prisma.AssetsGetPayload<typeof assetInclude>) {
   return {
      id: asset.id,
      name: asset.name,
      notes: asset.notes,
      uSize: asset.uSize,
      uTop: asset.uTop,
      uBottom: asset.uBottom,

      ports: asset.Ports.map((port) => serializePort(port))
   };
}
