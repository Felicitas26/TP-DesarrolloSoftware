CREATE DATABASE IF NOT EXISTS `event_hall`
/*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
/*!80016 DEFAULT ENCRYPTION='N' */;

USE `event_hall`;

-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: event_hall
-- ------------------------------------------------------
-- Server version 9.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- Table structure for table `carddetail`
--

DROP TABLE IF EXISTS `carddetail`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `carddetail` (
  `idCardDetail` int NOT NULL AUTO_INCREMENT,
  `menuStage` varchar(100) NOT NULL,
  `detail` varchar(255) NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `idContract` int NOT NULL,
  PRIMARY KEY (`idCardDetail`),
  KEY `idContract` (`idContract`),
  CONSTRAINT `carddetail_ibfk_1`
    FOREIGN KEY (`idContract`) REFERENCES `contract` (`idContract`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carddetail`
--

LOCK TABLES `carddetail` WRITE;
/*!40000 ALTER TABLE `carddetail` DISABLE KEYS */;
/*!40000 ALTER TABLE `carddetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `client` (
  `idCli` int NOT NULL AUTO_INCREMENT,
  `nameCli` varchar(100) NOT NULL,
  `surnameCli` varchar(100) NOT NULL,
  `phoneCli` varchar(20) NOT NULL,
  `dniCli` int NOT NULL,
  `addressCli` varchar(200) NOT NULL,
  `emailCli` varchar(150) NOT NULL,
  `cityCli` varchar(100) NOT NULL,
  PRIMARY KEY (`idCli`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `contract` (
  `idContract` int NOT NULL AUTO_INCREMENT,
  `eventStartTime` time NOT NULL,
  `eventEndTime` time NOT NULL,
  `dateContract` date NOT NULL,
  `finalValue` decimal(10,2) NOT NULL,
  `idReservation` int NOT NULL,
  PRIMARY KEY (`idContract`),
  KEY `idReservation` (`idReservation`),
  CONSTRAINT `contract_ibfk_1`
    FOREIGN KEY (`idReservation`) REFERENCES `reservation` (`idReservation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contractextraservice`
--

DROP TABLE IF EXISTS `contractextraservice`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `contractextraservice` (
  `idContract` int NOT NULL,
  `idService` int NOT NULL,
  PRIMARY KEY (`idContract`,`idService`),
  KEY `idService` (`idService`),
  CONSTRAINT `contractextraservice_ibfk_1`
    FOREIGN KEY (`idContract`) REFERENCES `contract` (`idContract`),
  CONSTRAINT `contractextraservice_ibfk_2`
    FOREIGN KEY (`idService`) REFERENCES `extraservice` (`idService`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contractextraservice`
--

LOCK TABLES `contractextraservice` WRITE;
/*!40000 ALTER TABLE `contractextraservice` DISABLE KEYS */;
/*!40000 ALTER TABLE `contractextraservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extraservice`
--

DROP TABLE IF EXISTS `extraservice`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `extraservice` (
  `idService` int NOT NULL AUTO_INCREMENT,
  `nameService` varchar(100) NOT NULL,
  `detailService` varchar(255) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idService`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extraservice`
--

LOCK TABLES `extraservice` WRITE;
/*!40000 ALTER TABLE `extraservice` DISABLE KEYS */;
/*!40000 ALTER TABLE `extraservice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `location` (
  `idLocation` int NOT NULL AUTO_INCREMENT,
  `city` varchar(100) NOT NULL,
  `zipCode` varchar(20) NOT NULL,
  PRIMARY KEY (`idLocation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lounge`
--

DROP TABLE IF EXISTS `lounge`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `lounge` (
  `idLounge` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `loungeAddress` varchar(200) NOT NULL,
  `idLoungeType` int NOT NULL,
  `idLocation` int NOT NULL,
  PRIMARY KEY (`idLounge`),
  KEY `idLoungeType` (`idLoungeType`),
  KEY `idLocation` (`idLocation`),
  CONSTRAINT `lounge_ibfk_1`
    FOREIGN KEY (`idLoungeType`) REFERENCES `loungetype` (`idLoungeType`),
  CONSTRAINT `lounge_ibfk_2`
    FOREIGN KEY (`idLocation`) REFERENCES `location` (`idLocation`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lounge`
--

LOCK TABLES `lounge` WRITE;
/*!40000 ALTER TABLE `lounge` DISABLE KEYS */;
/*!40000 ALTER TABLE `lounge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loungetype`
--

DROP TABLE IF EXISTS `loungetype`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `loungetype` (
  `idLoungeType` int NOT NULL AUTO_INCREMENT,
  `minQuantity` int NOT NULL,
  `maxQuantity` int NOT NULL,
  PRIMARY KEY (`idLoungeType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loungetype`
--

LOCK TABLES `loungetype` WRITE;
/*!40000 ALTER TABLE `loungetype` DISABLE KEYS */;
/*!40000 ALTER TABLE `loungetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price`
--

DROP TABLE IF EXISTS `price`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `price` (
  `idPrice` int NOT NULL AUTO_INCREMENT,
  `effectiveDate` date NOT NULL,
  `endDate` date DEFAULT NULL,
  `value` decimal(10,2) NOT NULL,
  `idLoungeType` int NOT NULL,
  PRIMARY KEY (`idPrice`),
  KEY `idLoungeType` (`idLoungeType`),
  CONSTRAINT `price_ibfk_1`
    FOREIGN KEY (`idLoungeType`) REFERENCES `loungetype` (`idLoungeType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price`
--

LOCK TABLES `price` WRITE;
/*!40000 ALTER TABLE `price` DISABLE KEYS */;
/*!40000 ALTER TABLE `price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `reservation` (
  `idReservation` int NOT NULL AUTO_INCREMENT,
  `dateReservation` date NOT NULL,
  `status` varchar(50) NOT NULL,
  `guestQuantity` int NOT NULL,
  `idCli` int NOT NULL,
  `idLounge` int NOT NULL,
  PRIMARY KEY (`idReservation`),
  KEY `idCli` (`idCli`),
  KEY `idLounge` (`idLounge`),
  CONSTRAINT `reservation_ibfk_1`
    FOREIGN KEY (`idCli`) REFERENCES `client` (`idCli`),
  CONSTRAINT `reservation_ibfk_2`
    FOREIGN KEY (`idLounge`) REFERENCES `lounge` (`idLounge`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-24