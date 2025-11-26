-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-11-2025 a las 23:08:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pokedex_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pokemon`
--

CREATE TABLE `pokemon` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo1` varchar(30) NOT NULL,
  `tipo2` varchar(20) DEFAULT NULL,
  `hp` int(11) NOT NULL,
  `ataque` int(11) NOT NULL,
  `defensa` int(11) NOT NULL,
  `ataque_esp` int(11) NOT NULL,
  `defensa_esp` int(11) NOT NULL,
  `velocidad` int(11) NOT NULL,
  `imagen_nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `habilidad` varchar(100) DEFAULT NULL,
  `altura` varchar(20) DEFAULT NULL,
  `peso` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pokemon`
--

INSERT INTO `pokemon` (`id`, `nombre`, `tipo1`, `tipo2`, `hp`, `ataque`, `defensa`, `ataque_esp`, `defensa_esp`, `velocidad`, `imagen_nombre`, `descripcion`, `habilidad`, `altura`, `peso`) VALUES
(12, 'Charmander', 'Fuego', NULL, 50, 50, 50, 0, 0, 0, 'poke_690d3f45eb1279.47151167.jpg', 'hola', 'Mar Llamas', '', ''),
(13, 'Bulbasaur', 'Planta', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d497598f0b2.28101516.jpg', 'Esta chulo ', NULL, NULL, NULL),
(14, 'Pikachu', 'Eléctrico', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d49e3a832b0.69581788.jpg', 'Pika pi?', NULL, NULL, NULL),
(15, 'Squirtle', 'Agua', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d529501dcc3.89486740.jpg', 'BABABABABA', NULL, NULL, NULL),
(16, 'Pidgey', 'Volador', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d538ca93573.06991309.jpg', 'vuela', NULL, NULL, NULL),
(17, 'Gengar', 'Venenoso', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d54c099e003.81997271.jpg', 'morado', NULL, NULL, NULL),
(18, 'Oddish', 'Venenoso', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d5732389232.81010602.jpg', 'sepa la bola', NULL, NULL, NULL),
(19, 'Haxorus ', 'Dragón', NULL, 50, 50, 50, 0, 121, 100, 'poke_690d3f45eb1279.47151167.jpg', 'Esta chulo ', 'Mar Llamas', '0,6 metros', '8,5 kilogramos'),
(20, 'Kubfu ', 'Lucha', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d5a26c1d0b6.66304315.jpg', 'Lucha libre o mamá lucha???', NULL, NULL, NULL),
(21, 'Falinks', 'Lucha', NULL, 50, 50, 50, 50, 50, 50, 'poke_690d5aa7260903.40782999.jpg', 'Esta mosho ', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pokemon`
--
ALTER TABLE `pokemon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pokemon`
--
ALTER TABLE `pokemon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
