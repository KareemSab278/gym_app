-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2024 at 01:20 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gym_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `availability` tinyint(1) DEFAULT 1,
  `image` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `name`, `type`, `availability`, `image`) VALUES
(1, 'Bench Press', 'Strength', 1, NULL),
(2, 'Dumbbells', 'Weights', 1, NULL),
(3, 'Squat Rack', 'Strength', 1, NULL),
(4, 'Cable Machine', 'Machine', 1, NULL),
(5, 'Treadmill', 'Cardio', 1, NULL),
(6, 'Elliptical', 'Cardio', 1, NULL),
(8, 'Default Equipment Name', 'Default Type', 1, 0x64656661756c742d696d6167652e6a7067);

-- --------------------------------------------------------

--
-- Table structure for table `gym_preferences`
--

CREATE TABLE `gym_preferences` (
  `user_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `hours_used` int(11) DEFAULT NULL,
  `usage_date` datetime NOT NULL,
  `end_usage_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_preferences`
--

INSERT INTO `gym_preferences` (`user_id`, `equipment_id`, `hours_used`, `usage_date`, `end_usage_date`) VALUES
(3, 1, 0, '2024-11-04 11:59:24', '2024-11-04 11:59:29'),
(3, 1, 0, '2024-11-04 12:15:28', '2024-11-04 12:15:38'),
(5, 5, 0, '2024-11-04 12:17:19', '2024-11-04 12:17:20'),
(5, 6, 0, '2024-11-04 12:17:17', '2024-11-04 12:17:18');

-- --------------------------------------------------------

--
-- Table structure for table `gym_users`
--

CREATE TABLE `gym_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `funds` decimal(10,2) DEFAULT 10.00,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_users`
--

INSERT INTO `gym_users` (`id`, `name`, `email`, `telephone`, `dob`, `sex`, `funds`, `password`) VALUES
(2, 'John Doe', 'johndoe@example.com', '1234567890', '1990-01-01', 'Male', 10.00, '$2b$10$pRXcEJpBHN4NyRs47GNLOekyDQQ5FUsnltBBbCZG2j7xj9OLtxK3i'),
(3, 'Sandeep Rahal', 'sandeeprahal97@gmail.com', '07964 764569', '0000-00-00', 'Male', 9.00, '$2b$10$uBo8eax7Rvia2NoLXH6xsunIlavM4tkDxcygM.bhBZo.7/oDKaSce'),
(5, 'Kareem Elsabrouty', 'kareemsab278@gmail.com', '07793515995', '2000-08-27', 'Male', 9.00, '$2b$10$oL2c/XtGLPxWEnc3HCXxK.EfCTHvi73DnsRFzcI2jLXSDVc4U7vAG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gym_preferences`
--
ALTER TABLE `gym_preferences`
  ADD PRIMARY KEY (`user_id`,`equipment_id`,`usage_date`),
  ADD KEY `fk_equipment` (`equipment_id`);

--
-- Indexes for table `gym_users`
--
ALTER TABLE `gym_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `gym_users`
--
ALTER TABLE `gym_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gym_preferences`
--
ALTER TABLE `gym_preferences`
  ADD CONSTRAINT `fk_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `gym_users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gym_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `gym_users` (`id`),
  ADD CONSTRAINT `gym_preferences_ibfk_2` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
