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
                };
                // res.render('registration_success', account_type);
            });
        } else {
            throw 'ERROR - Account type can just be either user or client';
        }
        // res.render('registration_success');
    });

router.route('/registration_success').get((req, res, next) => {
    res.render('registration_success', {
        account_type: req.query.account,
        name: req.query.name
    });
});
module.exports = router;