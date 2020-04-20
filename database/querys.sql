/* CREATE DATABASE*/
CREATE DATABASE rent_app;

/*CREATE admin TABLE*/
CREATE TABLE admins (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username varchar(64) NOT NULL,
    password varchar(64) NOT NULL
);
/* CREATE users TABLE*/
CREATE TABLE users (
    id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name varchar(200) NOT NULL,
    email varchar(200) NOT NULL,
    password varchar(64) NOT NULL,
    registration_status varchar(45) DEFAULT 'pending',
    approved_by int,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approvation_date DATETIME,
    FOREIGN KEY (approved_by) REFERENCES admins(id)
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
    model varchar(64),
    year int(5) NOT NULL,
    kilometers int(16) NOT NULL,
    status varchar(10) NOT NULL,
    image_name varchar(300)  
);

/* CREATE rents TABLE*/
CREATE TABLE rents (
  rent_id SERIAL PRIMARY KEY,
  car_id INT NOT NULL,
  client_id INT NOT NULL,
  user_rental_id INT NOT NULL,
  rental_date DATE NOT NULL,
  return_date DATE NOT NULL,
  FOREIGN KEY (car_id) REFERENCES cars(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (user_rental_id) REFERENCES users(id)
);