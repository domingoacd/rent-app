/* CREATE DATABASE*/
CREATE DATABASE rent_app;

/* CREATE users TABLE*/
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR (200) NOT NULL,
    email VARCHAR (200) NOT NULL,
    password VARCHAR (64) NOT NULL
);

/* CREATE clients TABLE*/
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR (200) NOT NULL,
    license_number VARCHAR (200) NOT NULL,
    phone_number VARCHAR (64) NOT NULL
);

/* CREATE cars TABLE*/
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    kilometers INT NOT NULL,
    status VARCHAR (10) NOT NULL CHECK(status === 'rented' OR status === 'available')  
);