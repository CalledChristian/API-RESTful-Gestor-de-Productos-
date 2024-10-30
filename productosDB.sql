-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema productos
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema productos
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `productos` DEFAULT CHARACTER SET utf8 ;
USE `productos` ;

-- -----------------------------------------------------
-- Table `productos`.`productos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `productos`.`productos` (
  `idproducto` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL,
  `marca` VARCHAR(45) NOT NULL,
  `precio` INT NOT NULL,
  PRIMARY KEY (`idproducto`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
