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
CREATE TABLE cars (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    year int(5) NOT NULL,
    kilometers int(16) NOT NULL,
    status varchar(10) NOT NULL,
    CHECK(status == "rented" OR status == "available")  
);