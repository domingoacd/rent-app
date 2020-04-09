const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', async (req, res, next) => {
    res.render('home');
});

router.route('/signup')
    .get((req, res, next) => {
        res.render('signup');
    })
    .post(async (req, res, next) => {
        const {account_type} = req.body;
        
        if (account_type == 'user') {
            await database.query(`INSERT INTO users (full_name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`, (err, result) => {
                if (err) {
                    throw err;       
                } else {
                    res.redirect(`/registration_success?account=${account_type}&name=${req.body.name}`);
                }
                
            });
            
        } else if (account_type == 'client') {
            await database.query(`INSERT INTO clients (full_name, license_number, phone_number) VALUES ("${req.body.name}", "${req.body.license}", "${req.body.phone}")`, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    res.redirect(`/registration_success?account=${account_type}&name=${req.body.name}`);
                }
                // res.render('registration_success', account_type);
            });
        } else {
            throw 'ERROR - Account type can just be either user or client';
        }
        // res.render('registration_success');
    });

router.route('/signin')
    .get((req, res, next) => {
        res.render('signin');
    })
    .post(async (req, res, next) => {
        await database.query(`SELECT * FROM users WHERE email = "${req.body.email}" AND password = "${req.body.password}"`, (err, result) => {
            if (err) {
                throw err;
            } else {
                const user_data = result[0];
                if(user_data) {
                    console.log(user_data);
                } else {
                    console.log('no data');
                }
            }
        });
        res.send('hey');
    });
    
router.route('/registration_success').get((req, res, next) => {
    res.render('registration_success', {
        isAClient: req.query.account == 'client',
        name: req.query.name
    });
});

router.route('/admin')
    .get((req, res, next) => {
        res.render('admin');
    })
    .post(async (req, res, next) => {
        await database.query(`SELECT * FROM admins WHERE username = "${req.body.username}" AND password = "${req.body.password}"`, (err, result) => {
            if (err) {
                throw err;
            } else {
                const admin_data = result[0];
                console.log(admin_data);
            }
        });
        res.send('hey')
    });
module.exports = router;