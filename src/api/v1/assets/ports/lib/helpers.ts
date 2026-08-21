import { prisma } from '../../../../../lib/prisma';
export async function assetExists(id: number) {
   const asset = await prisma.assets.findUnique({
      where: {
         id
      }
   });
   return Boolean(asset);
}
