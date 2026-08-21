-- ===========================================================
-- Redfish Database Schema
-- MySQL 8+
-- ===========================================================
DROP DATABASE IF EXISTS redfish;
CREATE DATABASE redfish CHARACTER
SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE redfish;
-- ===========================================================
-- Assets
-- ===========================================================
CREATE TABLE Assets (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   notes TEXT NULL,
   uTop INT NOT NULL DEFAULT 0,
   uBottom INT NOT NULL DEFAULT 0,
   uSize INT NOT NULL DEFAULT 1
);
-- ===========================================================
-- PortTypes
-- ===========================================================
CREATE TABLE PortTypes (
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255) NOT NULL
);
-- ===========================================================
-- Ports
-- ===========================================================
CREATE TABLE Ports (
   id INT AUTO_INCREMENT PRIMARY KEY,
   assetId INT NOT NULL,
   portIndex INT NOT NULL,
   portTypeId INT NOT NULL,
   CONSTRAINT uq_assetid_index UNIQUE (assetId, portIndex),
   CONSTRAINT fk_ports_porttype FOREIGN KEY (portTypeId) REFERENCES PortTypes (id) ON DELETE CASCADE,
   CONSTRAINT fk_ports_assets FOREIGN KEY (assetId) REFERENCES Assets (id) ON DELETE CASCADE
);
-- ===========================================================
-- PortConnections
-- ===========================================================
CREATE TABLE PortConnections (
   id INT AUTO_INCREMENT PRIMARY KEY,
   PortAId INT NOT NULL,
   PortBId INT NOT NULL,
   CONSTRAINT chk_connection_port_order CHECK (portAId < portBId),
   CONSTRAINT uq_portconnection UNIQUE (PortAId, PortBId),
   CONSTRAINT fk_porta_ports FOREIGN KEY (PortAId) REFERENCES Ports (id) ON DELETE CASCADE,
   CONSTRAINT fk_portb_ports FOREIGN KEY (PortBId) REFERENCES Ports (id) ON DELETE CASCADE
);
-- ===========================================================
-- Test Data
-- ===========================================================
-- -----------------------------------------------------------
-- Assets
-- -----------------------------------------------------------
INSERT INTO Assets (name, notes, uTop, uBottom, uSize)
VALUES (
      'Core Switch 01',
      'Main core network switch',
      1,
      2,
      2
   ),
   (
      'Access Switch 01',
      'Access layer switch',
      1,
      1,
      1
   ),
   ('Server 01', 'Application server', 2, 0, 2);
-- -----------------------------------------------------------
-- Port Types
-- -----------------------------------------------------------
INSERT INTO PortTypes (name)
VALUES ('Ethernet'),
   ('SFP'),
   ('Fiber');
-- -----------------------------------------------------------
-- Ports
--
-- Core Switch 01 (Asset 1)
--   Port 1 -> Ethernet
--   Port 2 -> Ethernet
--   Port 3 -> SFP
--   Port 4 -> SFP
--
-- Access Switch 01 (Asset 2)
--   Port 1 -> Ethernet
--   Port 2 -> Ethernet
--   Port 3 -> SFP
--
-- Server 01 (Asset 3)
--   Port 1 -> Ethernet
--   Port 2 -> Ethernet
-- -----------------------------------------------------------
INSERT INTO Ports (assetId, portIndex, portTypeId)
VALUES -- Core Switch 01
   (1, 1, 1),
   (1, 2, 1),
   (1, 3, 2),
   (1, 4, 2),
   -- Access Switch 01
   (2, 1, 1),
   (2, 2, 1),
   (2, 3, 2),
   -- Server 01
   (3, 1, 1),
   (3, 2, 1);
-- -----------------------------------------------------------
-- Port Connections
--
-- Core Switch 01 Port 1 -> Access Switch 01 Port 1
-- Core Switch 01 Port 2 -> Access Switch 01 Port 2
-- Core Switch 01 Port 3 -> Access Switch 01 Port 3
-- Core Switch 01 Port 4 -> Server 01 Port 1
-- Access Switch 01 Port 2 -> Server 01 Port 2
--
-- Port IDs are:
--
-- Core Switch 01:
--   1, 2, 3, 4
--
-- Access Switch 01:
--   5, 6, 7
--
-- Server 01:
--   8, 9
--
-- -----------------------------------------------------------
INSERT INTO PortConnections (PortAId, PortBId)
VALUES (1, 5),
   -- Core 01 port 1 -> Access 01 port 1
   (2, 6),
   -- Core 01 port 2 -> Access 01 port 2
   (3, 7),
   -- Core 01 port 3 -> Access 01 port 3
   (4, 8),
   -- Core 01 port 4 -> Server 01 port 1
   (6, 9);
-- Access 01 port 2 -> Server 01 port 2