const express = require('express');
const router = express.Router();
const database = require('../database/connect');

let pending_users = null;
router.route('/')
  .get((req, res, next) => {
    const errorHappened = req.query.error;
    let errorHandler = null;

    if (req.session.already_logged) {
      res.redirect('/admin/main');
    } else {
      if (errorHappened) {
        errorHandler = {
          error: true,
          unknown_error: errorHappened == 'unknow'
        };
      }
      res.render('admin', errorHandler);
    }
  })
  .post(async (req, res, next) => {
    await database.query(
      `SELECT * FROM admins WHERE username = "${req.body.username}" AND password = "${req.body.password}"`,
      async (err, result) => {
        if (err) {
          res.redirect('/admin?error=unknow');
          throw err;
        } else {
          const admin_data = result[0];

          if (admin_data) {
            req.session.already_logged = true;
            req.session.admin_user = admin_data.id;

            await database.query(
              `SELECT * FROM users WHERE registration_status = "pending"`,
              (err, result) => {
                if (err) {
                  res.redirect('/admin?error=unknow');
                  throw err;
                } else {
                  result.forEach(entry => {
                    entry.registration_date = entry.registration_date
                      .toString()
                      .slice(4, 15);
                  });
                  pending_users = result;
                  res.redirect('/admin/main');
                }
              }
            );
          } else {
            res.redirect('/admin?error=wrong_credentials');
          }
        }
      }
    );
  });

router.get('/main', (req, res, next) => {
  if (req.session.already_logged) {
    res.render('admin_main', {
      pending_users: pending_users
    });
  } else {
    res.redirect('/admin');
  }
});  

module.exports = router;