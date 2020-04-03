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
        console.log(account_type)

        if (account_type == 'user') {
            await database.query(`INSERT INTO users (full_name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${req.body.password}")`, (err, result) => {
                if (err) throw err;
                console.log('Inserted!');
            });

        } else if (account_type == 'client') {
            await database.query(`INSERT INTO clients (full_name, license_number, phone_number) VALUES ("${req.body.name}", "${req.body.license}", "${req.body.phone}")`, (err, result) => {
                if (err) {
                    throw err;
                };
                console.log('Inserted client!');
            });
        } else {
            throw 'ERROR - Account type can just be either user or client';
        }
        res.send('<h1>Inserted!</h1>');
    });
module.exports = router;