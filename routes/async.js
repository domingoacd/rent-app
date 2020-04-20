const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 
const image_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'database/car_images');
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

  await database.query(`INSERT INTO cars (model, year, kilometers, status, image_name) VALUES ("${req.body.model}", ${req.body.year}, ${req.body.kilometers}, "available", "${req.file.filename}")`, (err, result) => {
    if (err) {
      throw err;
    } else {
      
    }
  });
});
module.exports = router;