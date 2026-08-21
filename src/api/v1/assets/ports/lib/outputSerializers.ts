import { Prisma } from '@prisma/client';
import { portInclude } from './includeSerializers';

export function serializePort(port: Prisma.PortsGetPayload<typeof portInclude>) {
   const connectedPorts = [
      ...port.PortConnections_PortConnections_PortAIdToPorts.map(
         (connection) => connection.Ports_PortConnections_PortBIdToPorts
      ),
      ...port.PortConnections_PortConnections_PortBIdToPorts.map(
         (connection) => connection.Ports_PortConnections_PortAIdToPorts
      )
   ];

   return {
      id: port.id,
      portIndex: port.portIndex,
      portType: port.PortTypes,

      connectedPorts: connectedPorts.map((connectedPort) => ({
         id: connectedPort.id,
         assetId: connectedPort.assetId,
         portIndex: connectedPort.portIndex,
         portType: connectedPort.PortTypes
      }))
   };
}
