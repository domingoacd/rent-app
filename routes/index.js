const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', async (req, res, next) => {
  res.render('home');
});

router
  .route('/signup')
  .get((req, res, next) => {
    res.render('signup');
  })
  .post(async (req, res, next) => {
      await database.query(
        `INSERT INTO users (full_name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`,
        (err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect(
              `/registration_success?name=${req.body.name}`
            );
          }
        }
      );
    // res.render('registration_success');
  });

router
  .route('/signin')
  .get((req, res, next) => {
    res.render('signin');
  })
  .post(async (req, res, next) => {
    await database.query(
      `SELECT * FROM users WHERE email = "${req.body.email}" AND password = "${req.body.password}"`,
      (err, result) => {
        let user_data;
        if (err) {
          throw err;
        } else {
          user_data = result[0];
          
          if (user_data) {
            req.session.user = user_data.id;
            req.session.user_name = user_data.full_name;
            req.session.user_status = user_data.registration_status;
            res.redirect('/panel');
          } else {
            console.log('no data');
            res.render('signin', {error:true});
          }
        }
      }
    );
  });

router.route('/registration_success').get((req, res, next) => {
  res.render('registration_success', {
    isAClient: req.query.account == 'client',
    name: req.query.name
  });
});

module.exports = router;
