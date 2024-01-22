/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` varchar(300) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `realEstateId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `realEstateId` (`realEstateId`),
  KEY `userId` (`userId`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`realEstateId`) REFERENCES `realestates` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` varchar(60) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `realestates` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `rooms` int NOT NULL,
  `parking` int NOT NULL,
  `wc` int NOT NULL,
  `street` varchar(60) NOT NULL,
  `lat` varchar(255) NOT NULL,
  `lng` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `public` int NOT NULL DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `priceId` int DEFAULT NULL,
  `categoryId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `priceId` (`priceId`),
  KEY `categoryId` (`categoryId`),
  KEY `userId` (`userId`),
  CONSTRAINT `realestates_ibfk_1` FOREIGN KEY (`priceId`) REFERENCES `prices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `realestates_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `realestates_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(60) NOT NULL,
  `active` int DEFAULT '0',
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Casa', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(2, 'Apartamento', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(3, 'Terreno', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(4, 'Local Comercial', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(5, 'Bodega', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(6, 'Oficina', '2024-01-10 19:34:39', '2024-01-10 19:34:39');



INSERT INTO `prices` (`id`, `price`, `createdAt`, `updatedAt`) VALUES
(1, '0 - $10,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `prices` (`id`, `price`, `createdAt`, `updatedAt`) VALUES
(2, '$10,000 - $30,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `prices` (`id`, `price`, `createdAt`, `updatedAt`) VALUES
(3, '$30,000 - $50,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39');
INSERT INTO `prices` (`id`, `price`, `createdAt`, `updatedAt`) VALUES
(4, '$50,000 - $75,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(5, '$75,000 - $100,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(6, '$100,000 - $150,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(7, '$150,000 - $200,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(8, '$200,000 - $300,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(9, '$300,000 - $500,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39'),
(10, '+ $500,000 USD', '2024-01-10 19:34:39', '2024-01-10 19:34:39');



INSERT INTO `users` (`id`, `name`, `email`, `password`, `active`, `token`, `createdAt`, `updatedAt`) VALUES
(1, 'Alejandro', 'alejobetancur2@gmail.com', '$2b$10$Ph2EI2KVZLJcofDO4PjLCOrZpP5W/Oe.Jr8G6ztM7gl4hgx84OTSC', 1, NULL, '2024-01-10 19:34:39', '2024-01-10 19:34:39');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;