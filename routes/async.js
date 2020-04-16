const express = require('express');
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

router.get('/logOut', async (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    } else {
      res.send({ loggedOut: true });
    }
  });
});

module.exports = router;