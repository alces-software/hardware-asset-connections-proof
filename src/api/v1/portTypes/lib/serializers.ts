import { Prisma } from '@prisma/client';
import { portTypeInclude } from './includes';

export function serializePortType(portType: Prisma.PortTypesGetPayload<typeof portTypeInclude>) {
   return {
      id: portType.id,
      name: portType.name
   };
}
