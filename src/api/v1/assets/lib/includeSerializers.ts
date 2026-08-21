import { Prisma } from '@prisma/client';
import { portInclude } from '../ports/lib/includeSerializers';

export const assetInclude = Prisma.validator<Prisma.AssetsDefaultArgs>()({
   include: {
      Ports: {
         ...portInclude
      }
   }
});
