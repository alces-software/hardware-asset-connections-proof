import { Prisma } from '@prisma/client';
import { portInclude } from '../../../lib/includes';
import { combineConnections } from '../../../lib/serializers';

export function serializePort(port: Prisma.PortsGetPayload<typeof portInclude>) {
   const connectedPorts = combineConnections(port);

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
