import { Prisma } from '@prisma/client';

export const portInclude = Prisma.validator<Prisma.PortsDefaultArgs>()({
   include: {
      PortTypes: true,
      PortConnections_PortConnections_PortAIdToPorts: {
         include: {
            Ports_PortConnections_PortBIdToPorts: {
               include: {
                  PortTypes: true
               }
            }
         }
      },

      PortConnections_PortConnections_PortBIdToPorts: {
         include: {
            Ports_PortConnections_PortAIdToPorts: {
               include: {
                  PortTypes: true
               }
            }
         }
      }
   }
});
