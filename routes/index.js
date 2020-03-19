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
        await database.query(`INSERT INTO clients (full_name, license_number, phone_number) VALUES ("${req.body.name}", ${req.body.license}, ${req.body.phone})`, (err, result) => {
            if (err) throw err;
            console.log('Inserted!');
        })
        res.send('<h1>Inserted!</h1>');
    });
module.exports = router;