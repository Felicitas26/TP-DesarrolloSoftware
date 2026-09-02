DROP DATABASE IF EXISTS `event_hall`;
CREATE DATABASE `event_hall`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;
USE `event_hall`;

-- 1. Location 
CREATE TABLE `location` (
  `idLocation` INT NOT NULL AUTO_INCREMENT,
  `city` VARCHAR(100) NOT NULL,
  `zipCode` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`idLocation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Client 
CREATE TABLE `client` (
  `idCli` INT NOT NULL AUTO_INCREMENT,
  `nameCli` VARCHAR(100) NOT NULL,
  `surnameCli` VARCHAR(100) NOT NULL,
  `phoneCli` VARCHAR(20) NOT NULL,
  `dniCli` INT NOT NULL,
  `addressCli` VARCHAR(200) NOT NULL,
  `emailCli` VARCHAR(150) NOT NULL,
  `idLocation` INT NOT NULL,
  PRIMARY KEY (`idCli`),
  KEY `idLocation` (`idLocation`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`idLocation`) REFERENCES `location` (`idLocation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Lounge 
CREATE TABLE `lounge` (
  `idLounge` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `loungeAddress` VARCHAR(200) NOT NULL,
  `idLocation` INT NOT NULL,
  PRIMARY KEY (`idLounge`),
  KEY `idLocation` (`idLocation`),
  CONSTRAINT `lounge_ibfk_1` FOREIGN KEY (`idLocation`) REFERENCES `location` (`idLocation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. LoungeType
CREATE TABLE `loungeType` (
  `idLoungeType` INT NOT NULL AUTO_INCREMENT,
  `minQuantity` INT NOT NULL,
  `maxQuantity` INT NOT NULL,
  `idLounge` INT NOT NULL,
  PRIMARY KEY (`idLoungeType`),
  KEY `idLounge` (`idLounge`),
  CONSTRAINT `loungetype_ibfk_1` FOREIGN KEY (`idLounge`) REFERENCES `lounge` (`idLounge`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Price 
CREATE TABLE `price` (
  `effectiveDate` DATE NOT NULL,
  `endDate` DATE DEFAULT NULL,
  `value` DECIMAL(10,2) NOT NULL,
  `idLoungeType` INT NOT NULL,
  PRIMARY KEY (`effectiveDate`, `idLoungeType`),
  KEY `idLoungeType` (`idLoungeType`),
  CONSTRAINT `price_ibfk_1` FOREIGN KEY (`idLoungeType`) REFERENCES `loungetype` (`idLoungeType`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Reservation (Consolida la Doble Agregación: Client + Lounge + LoungeType)
CREATE TABLE `reservation` (
  `idReservation` INT NOT NULL AUTO_INCREMENT,
  `dateReservation` DATE NOT NULL,
  `dateEvent` DATE NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `cantInvit` INT NOT NULL,
  `idCli` INT NOT NULL,
  `idLounge` INT NOT NULL,
  `idLoungeType` INT NOT NULL,
  PRIMARY KEY (`idReservation`),
  KEY `idCli` (`idCli`),
  KEY `idLounge` (`idLounge`),
  KEY `idLoungeType` (`idLoungeType`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`idCli`) REFERENCES `client` (`idCli`),
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`idLounge`) REFERENCES `lounge` (`idLounge`),
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`idLoungeType`) REFERENCES `loungetype` (`idLoungeType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. ExtraService
CREATE TABLE `extraservice` (
  `idService` INT NOT NULL AUTO_INCREMENT,
  `nameService` VARCHAR(100) NOT NULL,
  `detailService` VARCHAR(255) NOT NULL,
  `cost` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`idService`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Contract
CREATE TABLE `contract` (
  `idContract` INT NOT NULL AUTO_INCREMENT,
  `eventStartTime` TIME NOT NULL,
  `eventEndTime` TIME NOT NULL,
  `dateContract` DATE NOT NULL,
  `finalValue` DECIMAL(10,2) NOT NULL,
  `idReservation` INT NOT NULL,
  PRIMARY KEY (`idContract`),
  KEY `idReservation` (`idReservation`),
  CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`idReservation`) REFERENCES `reservation` (`idReservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Payment (Pagos / Anticipos)
CREATE TABLE `payment` (
  `idPayment` INT NOT NULL AUTO_INCREMENT,
  `value` DECIMAL(10,2) NOT NULL,
  `statusPayment` VARCHAR(50) NOT NULL,
  `datePayment` DATE NOT NULL,
  `idContract` INT NOT NULL,
  PRIMARY KEY (`idPayment`),
  KEY `idContract` (`idContract`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`idContract`) REFERENCES `contract` (`idContract`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. CardDetail (Detalle de Tarjetas / Menú)
CREATE TABLE `cardDetail` (
  `idCardDetail` INT NOT NULL AUTO_INCREMENT,
  `menuStage` VARCHAR(100) NOT NULL,
  `detail` VARCHAR(255) NOT NULL,
  `budget` DECIMAL(10,2) NOT NULL,
  `idContract` INT NOT NULL,
  PRIMARY KEY (`idCardDetail`),
  KEY `idContract` (`idContract`),
  CONSTRAINT `cardDetail_ibfk_1` FOREIGN KEY (`idContract`) REFERENCES `contract` (`idContract`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ContractExtraService (Relación N:M entre Contrato y Servicios Extras)
CREATE TABLE `contractextraservice` (
  `idContract` INT NOT NULL,
  `idService` INT NOT NULL,
  PRIMARY KEY (`idContract`, `idService`),
  KEY `idService` (`idService`),
  CONSTRAINT `contractextraservice_ibfk_1` FOREIGN KEY (`idContract`) REFERENCES `contract` (`idContract`),
  CONSTRAINT `contractextraservice_ibfk_2` FOREIGN KEY (`idService`) REFERENCES `extraservice` (`idService`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Usuario (Especialización total y disjunta por rol: administrador | cliente)
--     El rol actúa como discriminador. El cliente se vincula a su ficha (client) por idCli.
--     El password se almacena con hash (bcrypt) y passwordTemporal indica si es provisoria.
CREATE TABLE `usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('administrador','cliente') NOT NULL,
  `idCli` INT DEFAULT NULL,
  `passwordTemporal` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `username` (`username`),
  KEY `idCli` (`idCli`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idCli`) REFERENCES `client` (`idCli`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
