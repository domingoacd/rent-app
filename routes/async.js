const express = require('express');
const router = express.Router();
const database = require('../database/connect');
const utilities = require('../src/utilities');
const fs = require('fs');

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
router.post('/saveNewCar', async (req, res, next) => {
  console.log(req.body);
  await database.query(`INSERT INTO cars (model, year, kilometers, status) VALUES ("${req.body.model}", ${req.body.year}, ${req.body.kilometers}, "available")`, (err, result) => {
    // const car_image_
    if (err) {
      throw err;
    } else {
      try {
        if(!fs.existsSync())
        fs.mkdirSync()
      } catch (e) {
        
      }
    }
  });
});
module.exports = router;