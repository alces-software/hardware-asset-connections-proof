import { Prisma } from '@prisma/client';
import { portInclude } from './includes';

export function combineConnections(port: Prisma.PortsGetPayload<typeof portInclude>) {
   return [
      ...port.PortConnections_PortConnections_PortAIdToPorts.map(
         (connection) => connection.Ports_PortConnections_PortBIdToPorts
      ),
      ...port.PortConnections_PortConnections_PortBIdToPorts.map(
         (connection) => connection.Ports_PortConnections_PortAIdToPorts
      )
   ];
}
