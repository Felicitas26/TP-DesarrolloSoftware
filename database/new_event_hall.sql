CREATE DATABASE IF NOT EXISTS event_hall;

USE event_hall;

SET FOREIGN_KEY_CHECKS = 0;


DROP TABLE IF EXISTS reservationextraservice;
DROP TABLE IF EXISTS contractextraservice;
DROP TABLE IF EXISTS payment;
DROP TABLE IF EXISTS contract;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS price;
DROP TABLE IF EXISTS loungetype;
DROP TABLE IF EXISTS lounge;
DROP TABLE IF EXISTS location;
DROP TABLE IF EXISTS extraservice;
DROP TABLE IF EXISTS carddetail;


CREATE TABLE carddetail (
    idCardDetail INT NOT NULL AUTO_INCREMENT,
    menuStage VARCHAR(100) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    budget DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (idCardDetail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO carddetail (
    menuStage,
    detail,
    budget
) VALUES
(
    'Menú de hamburguesas',
    'Hamburguesas con acompañamiento',
    15000.00
),
(
    'Menú de pastas',
    'Pastas con salsa a elección',
    12000.00
),
(
    'Menú de mariscos',
    'Variedad de mariscos y acompañamiento',
    20000.00
);


CREATE TABLE location (
    idLocation INT NOT NULL AUTO_INCREMENT,
    city VARCHAR(100) NOT NULL,
    zipCode VARCHAR(20) NOT NULL,
    PRIMARY KEY (idLocation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO location (
    city,
    zipCode
) VALUES (
    'Rosario',
    '2000'
);


CREATE TABLE lounge (
    idLounge INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    loungeAddress VARCHAR(200) NOT NULL,
    idLocation INT NOT NULL,
    PRIMARY KEY (idLounge),
    KEY idLocation (idLocation),
    CONSTRAINT lounge_ibfk_1
        FOREIGN KEY (idLocation)
        REFERENCES location (idLocation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO lounge (
    name,
    loungeAddress,
    idLocation
) VALUES
(
    'Salón Grande (90-130)',
    'Av. Carlos Pellegrini 3135',
    1
),
(
    'Salón Pequeño (70-90)',
    'Av. Carlos Pellegrini 3135',
    1
);


CREATE TABLE loungetype (
    idLoungeType INT NOT NULL AUTO_INCREMENT,
    nameLoungeType VARCHAR(255) NOT NULL,
    minQuantity INT NOT NULL,
    maxQuantity INT NOT NULL,
    idLounge INT NOT NULL,
    PRIMARY KEY (idLoungeType),
    UNIQUE KEY uq_loungetype_name (idLounge, nameLoungeType),
    KEY idLounge (idLounge),
    CONSTRAINT loungetype_ibfk_1
        FOREIGN KEY (idLounge)
        REFERENCES lounge (idLounge)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO loungetype (
    nameLoungeType,
    minQuantity,
    maxQuantity,
    idLounge
) VALUES
(
    'Tipo Grande',
    90,
    130,
    1
),
(
    'Tipo Pequeño',
    70,
    90,
    2
);


CREATE TABLE price (
    effectiveDate DATE NOT NULL,
    endDate DATE DEFAULT NULL,
    value DECIMAL(10,2) NOT NULL,
    idLoungeType INT NOT NULL,
    PRIMARY KEY (effectiveDate, idLoungeType),
    KEY idLoungeType (idLoungeType),
    CONSTRAINT price_ibfk_1
        FOREIGN KEY (idLoungeType)
        REFERENCES loungetype (idLoungeType)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE client (
    idCli INT NOT NULL AUTO_INCREMENT,
    nameCli VARCHAR(100) NOT NULL,
    surnameCli VARCHAR(100) NOT NULL,
    phoneCli VARCHAR(20) NOT NULL,
    dniCli INT NOT NULL,
    addressCli VARCHAR(200) NOT NULL,
    emailCli VARCHAR(150) NOT NULL,
    idLocation INT NOT NULL,
    PRIMARY KEY (idCli),
    KEY idLocation (idLocation),
    CONSTRAINT client_ibfk_1
        FOREIGN KEY (idLocation)
        REFERENCES location (idLocation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE reservation (
    idReservation INT NOT NULL AUTO_INCREMENT,
    dateReservation DATE NOT NULL,
    dateEvent DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    cantInvit INT NOT NULL,
    idCli INT NOT NULL,
    idLounge INT NOT NULL,
    idLoungeType INT NOT NULL,
    idCardDetail INT DEFAULT NULL,
    PRIMARY KEY (idReservation),
    KEY idCli (idCli),
    KEY idLounge (idLounge),
    KEY idLoungeType (idLoungeType),
    KEY reservation_ibfk_4 (idCardDetail),
    CONSTRAINT reservation_ibfk_1
        FOREIGN KEY (idCli)
        REFERENCES client (idCli),
    CONSTRAINT reservation_ibfk_2
        FOREIGN KEY (idLounge)
        REFERENCES lounge (idLounge),
    CONSTRAINT reservation_ibfk_3
        FOREIGN KEY (idLoungeType)
        REFERENCES loungetype (idLoungeType),
    CONSTRAINT reservation_ibfk_4
        FOREIGN KEY (idCardDetail)
        REFERENCES carddetail (idCardDetail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE extraservice (
    idService INT NOT NULL AUTO_INCREMENT,
    nameService VARCHAR(100) NOT NULL,
    detailService VARCHAR(255) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (idService)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO extraservice (
    nameService,
    detailService,
    cost
) VALUES
(
    'DJ',
    'Servicio de música y animación durante el evento',
    50000.00
),
(
    'Fotografía',
    'Servicio de fotografía profesional durante el evento',
    40000.00
),
(
    'Decoración',
    'Decoración temática del salón',
    35000.00
),
(
    'Catering',
    'Servicio adicional de comida y bebidas',
    60000.00
),
(
    'Sonido e iluminación',
    'Equipamiento profesional de sonido e iluminación',
    45000.00
),
(
    'Pantalla y proyector',
    'Pantalla y proyector para presentaciones o videos',
    30000.00
);


CREATE TABLE reservationextraservice (
    idReservation INT NOT NULL,
    idService INT NOT NULL,
    PRIMARY KEY (idReservation, idService),
    KEY reservationextraservice_ibfk_2 (idService),
    CONSTRAINT reservationextraservice_ibfk_1
        FOREIGN KEY (idReservation)
        REFERENCES reservation (idReservation),
    CONSTRAINT reservationextraservice_ibfk_2
        FOREIGN KEY (idService)
        REFERENCES extraservice (idService)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE contract (
    idContract INT NOT NULL AUTO_INCREMENT,
    eventStartTime TIME NOT NULL,
    eventEndTime TIME NOT NULL,
    dateContract DATE NOT NULL,
    finalValue DECIMAL(10,2) NOT NULL,
    idReservation INT NOT NULL,
    PRIMARY KEY (idContract),
    UNIQUE KEY uq_contract_reservation (idReservation),
    KEY idReservation (idReservation),
    CONSTRAINT contract_ibfk_1
        FOREIGN KEY (idReservation)
        REFERENCES reservation (idReservation)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE contractextraservice (
    idContract INT NOT NULL,
    idService INT NOT NULL,
    PRIMARY KEY (idContract, idService),
    KEY idService (idService),
    CONSTRAINT contractextraservice_ibfk_1
        FOREIGN KEY (idContract)
        REFERENCES contract (idContract),
    CONSTRAINT contractextraservice_ibfk_2
        FOREIGN KEY (idService)
        REFERENCES extraservice (idService)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE payment (
    idPayment INT NOT NULL AUTO_INCREMENT,
    value DECIMAL(10,2) NOT NULL,
    statusPayment VARCHAR(50) NOT NULL,
    datePayment DATE NOT NULL,
    idContract INT NOT NULL,
    PRIMARY KEY (idPayment),
    KEY idContract (idContract),
    CONSTRAINT payment_ibfk_1
        FOREIGN KEY (idContract)
        REFERENCES contract (idContract)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE usuario (
    idUsuario INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('administrador','cliente') NOT NULL,
    idCli INT DEFAULT NULL,
    passwordTemporal TINYINT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (idUsuario),
    UNIQUE KEY username (username),
    KEY idCli (idCli),
    CONSTRAINT usuario_ibfk_1
        FOREIGN KEY (idCli)
        REFERENCES client (idCli)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO usuario (
    username,
    password,
    rol,
    idCli,
    passwordTemporal
) VALUES (
    'admin',
    '$2b$10$e0BPxUoATIG7JALND7Q.re6WGOEoo/aF3Xb4Evq5k7st/slvHh182',
    'administrador',
    NULL,
    0
);


SET FOREIGN_KEY_CHECKS = 1;