-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        10.6.5-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- code_analyze 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `code_analyze` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `code_analyze`;

-- 테이블 code_analyze.connects 구조 내보내기
CREATE TABLE IF NOT EXISTS `connects` (
  `UUID` varchar(50) NOT NULL,
  `time` datetime NOT NULL,
  KEY `FK_connects_users` (`UUID`),
  CONSTRAINT `FK_connects_users` FOREIGN KEY (`UUID`) REFERENCES `users` (`UUID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 code_analyze.scenes 구조 내보내기
CREATE TABLE IF NOT EXISTS `scenes` (
  `UUID` varchar(50) NOT NULL,
  `scene` varchar(50) NOT NULL,
  `time` time NOT NULL,
  PRIMARY KEY (`UUID`,`scene`),
  CONSTRAINT `FK_scenes_users` FOREIGN KEY (`UUID`) REFERENCES `users` (`UUID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 code_analyze.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `UUID` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `platform` enum('OSXEditor','OSXPlayer','WindowsPlayer','WindowsEditor','IPhonePlayer','Android','LinuxPlayer','LinuxEditor','WebGLPlayer','WSAPlayerX86','WSAPlayerX64','WSAPlayerARM','PS4','XboxOne','tvOS','Switch','Stadia','PS5','LinuxServer','WindowsServer','OSXServer','VisionOS') NOT NULL,
  `created` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
