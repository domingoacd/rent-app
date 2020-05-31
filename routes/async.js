const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 
const image_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/car_images');
  },
  filename: (req, file, cb) => {
    const file_name = `
      ${req.body.model}_${req.body.year}_${req.body.kilometers}_${Date.now()}${path.extname(file.originalname)}
    `; 
    cb(null, file_name.trim());
  }
});
const image_upload = multer({storage: image_storage});
const router = express.Router();
const database = require('../database/connect');
const utilities = require('../src/utilities');


router.post('/changeUsersStatus', async (req, res, next) => {
  const modifiedUsers = req.body;
  let pendingUsers = null;
  let error_updating = null;
  modifiedUsers.forEach(async user => {
    await database.query(
      `
        UPDATE users SET 
          registration_status = "${user.user_registration_status}",
          approved_by = "${req.session.admin_user}",
          approvation_date = NOW()
          WHERE id = ${user.user_id}`,
      (err, res) => {
        if (err) {
          error_updating = true;
          throw err;
        } else {
        }
      }
    );
  });

  if (error_updating) {
    res.send('error');
  } else {
    pendingUsers = await utilities.getPendingUsers();
    res.send({ pendingUsers: pendingUsers });
  }
});

router.get('/getPendingUsers', async (req, res, next) => {
  const users = {
    pendingUsers: await utilities.getPendingUsers()
  };
  res.send(users);
});

router.get('/logOut', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    } else {
      res.send({ loggedOut: true });
    }
  });
});
router.post('/saveNewCar', image_upload.single('image'), async (req, res, next) => {
  let car_image_path = null;
  if (req.file) {
    car_image_path = `"${req.file.path.split('public/')[1]}"`;
  }
  await database.query(`INSERT INTO cars (model, year, kilometers, status, image_name) VALUES ("${req.body.model}", ${req.body.year}, ${req.body.kilometers}, "available", ${car_image_path})`, async (err, result) => {
    let cars = null;
    if (err) {
      throw err;
    } else {
      cars = await utilities.getAllCars();
      res.send({cars: cars});    
    }
  });
});

router.post('/deleteCar', (req, res, next) => {
  console.log(req.body);
  const carId = req.body.carId;
  let status = {
    car_deleted: ''
  };
  database.query(`DELETE FROM cars WHERE id = ${carId}`, (err, result) => {
    if (err) {
      status.car_deleted = false;
      throw err
    } else {
      status.car_deleted = true;
    }
    res.send(status);
  })
});

router.post('/saveClient', async (req, res, next) => {
  let client_added = false;
  database.query(`INSERT INTO clients (full_name, license_number, phone_number) VALUES ("${req.body.full_name}", "${req.body.license}", "${req.body.phone_number}")`, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result);
      client_added = true;
    }
    res.send({
      client_added: client_added,
      client_info: { id: result.insertId, ...req.body}
    });
  });
  
});

router.post('/deleteClient', (req, res, next) => {
  database.query(`DELETE FROM clients WHERE id = ${req.body.id}`, (err, result) => {
    let clientDeleted = false;
    if (err) {
      throw err;
    } else {
      clientDeleted = true;
    }
    res.send({clientDeleted: clientDeleted});
  })
});

router.get('/getNotRentedCars', (req, res, next) => {
  database.query('SELECT * FROM cars WHERE status = "available"', (err, result) => {
    if (err) {
      throw err;
    } else {
     res.send({cars: result}); 
    }
  });
});

router.get('/getClients', (req, res, next) => {
  database.query('SELECT * FROM clients', (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send({clients: result});
    }
  })
});

router.post('/createRental', (req, res, next) => {
  let rentalCreated = false;
  database.query(
    `INSERT INTO rents (car_id, client_id, user_rental_id, rental_date, return_date) values (${req.body.car}, ${req.body.client}, ${req.body.createdBy}, NOW(), '${req.body.returnDate}')`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        rentalCreated = true;
      }
      res.send({
        rentalWasCreated: rentalCreated,
        rentalId: result.insertId
      });
    }
  );
});

router.post('/deleteRental', (req, res, next) => {
  const rentalId = req.body.rental;

  database.query(`DELETE FROM rents WHERE rent_id = ${rentalId}`, (err, result) => {
    let deleted = false;
    if (err) {
      throw err;
    } else {
      deleted = true;
    }
    res.send({
      rentalWasDeleted: deleted,
      id: rentalId
    });
  });
});
module.exports = router;