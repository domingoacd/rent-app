const express = require('express');
const router = express.Router();
const database = require('../database/connect');

let pending_users = null;
router.get('/', async (req, res, next) => {
  res.render('home');
});

router
  .route('/signup')
  .get((req, res, next) => {
    res.render('signup');
  })
  .post(async (req, res, next) => {
    const { account_type } = req.body;

    if (account_type == 'user') {
      await database.query(
        `INSERT INTO users (full_name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`,
        (err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect(
              `/registration_success?account=${account_type}&name=${req.body.name}`
            );
          }
        }
      );
    } else if (account_type == 'client') {
      await database.query(
        `INSERT INTO clients (full_name, license_number, phone_number) VALUES ("${req.body.name}", "${req.body.license}", "${req.body.phone}")`,
        (err, result) => {
          if (err) {
            throw err;
          } else {
            res.redirect(
              `/registration_success?account=${account_type}&name=${req.body.name}`
            );
          }
          // res.render('registration_success', account_type);
        }
      );
    } else {
      throw 'ERROR - Account type can just be either user or client';
    }
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
        if (err) {
          throw err;
        } else {
          const user_data = result[0];
          if (user_data) {
            console.log(user_data);
          } else {
            console.log('no data');
          }
        }
      }
    );
    res.send('hey');
  });

router.route('/registration_success').get((req, res, next) => {
  res.render('registration_success', {
    isAClient: req.query.account == 'client',
    name: req.query.name
  });
});

router
  .route('/admin')
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
          res.redirect("/admin?error=unknow");
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
router.get('/admin/main', (req, res, next) => {
  if (req.session.already_logged) {
    res.render('admin_main', {
      pending_users: pending_users
    });
  } else {
    res.redirect('/admin');
  }
});

async function getPendingUsers() {
    let users = null; 
    users = await new Promise((resolve, rejects) => 
      database.query( `SELECT id, full_name, email, registration_date, registration_status FROM users WHERE registration_status = "pending";`,
      (err, response) => {
          if (err) {
              reject(err);
          } else {
            response.forEach(entry => {
              entry.registration_date = entry.registration_date
                .toString()
                .slice(4, 15);
            });
            resolve(response);
          }
      }
    ));
    return users;
} 
router.post('/changeUsersStatus', async (req, res, next) => {
  const modifiedUsers = req.body;
  let pendingUsers = null;
  let error_updating = null;
  modifiedUsers.forEach(async user => {
    await database.query(`
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
    pendingUsers = await getPendingUsers();
    res.send({ pendingUsers: pendingUsers });
  }

});

router.get('/getPendingUsers', async (req, res, next) => {
  const users = {
    pendingUsers: await getPendingUsers()
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
