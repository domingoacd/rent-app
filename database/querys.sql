/* CREATE DATABASE*/
CREATE DATABASE rent_app;

/* CREATE users TABLE*/
CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    password varchar(64) NOT NULL
);

/* CREATE clients TABLE*/
CREATE TABLE clients (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name varchar(200) NOT NULL,
    license_number varchar(200) NOT NULL,
    phone_number varchar(64) NOT NULL
);

/* CREATE cars TABLE*/
