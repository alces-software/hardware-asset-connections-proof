import { Prisma } from '@prisma/client';
import { assetInclude } from './includeSerializers';
import { serializePort } from '../ports/lib/outputSerializers';

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
