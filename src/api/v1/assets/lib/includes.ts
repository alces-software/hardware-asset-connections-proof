import { Prisma } from '@prisma/client';
import { portInclude } from '../../lib/includes';

export const assetInclude = Prisma.validator<Prisma.AssetsDefaultArgs>()({
   include: {
      Ports: {
         ...portInclude
      }
   }
});
