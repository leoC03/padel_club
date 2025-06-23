CREATE DATABASE padel_club;
USE padel_club;

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50) NOT NULL,
    court INT NOT NULL,
    time VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    role ENUM('cliente', 'operador') DEFAULT 'cliente'
);