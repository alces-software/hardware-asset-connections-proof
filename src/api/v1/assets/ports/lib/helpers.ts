import { Prisma } from '@prisma/client';
import { prisma } from '../../../../../lib/prisma';
import { portInclude } from '../../../lib/includes';

export async function assetExists(id: number) {
   const asset = await prisma.assets.findUnique({
      where: {
         id
      }
   });
   return Boolean(asset);
}

export async function isValidPortType(id: number) {
   const portType = await prisma.portTypes.findUnique({
      where: {
         id
      }
   });
   return Boolean(portType);
}

export async function getPort(id: number) {
   const port = await prisma.ports.findUnique({
      where: {
         id
      },
      ...portInclude
   });
   return port;
}

export const createPort = async (assetId: number, portTypeId: number) => {
   for (let attempt = 0; attempt < 3; attempt++) {
      try {
         return await prisma.$transaction(async (tx) => {
            const asset = await tx.assets.findUnique({
               where: { id: assetId }
            });

            if (!asset) {
               return null;
            }

            const lastPort = await tx.ports.findFirst({
               where: {
                  assetId
               },
               orderBy: {
                  portIndex: 'desc'
               }
            });

            const nextIndex = (lastPort?.portIndex ?? 0) + 1;

            return tx.ports.create({
               data: {
                  assetId,
                  portTypeId,
                  portIndex: nextIndex
               },
               ...portInclude
            });
         });
      } catch (err) {
         if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002' &&
            attempt < 2
         ) {
            continue;
         }

         throw err;
      }
   }

   throw new Error('Failed to create port');
};
