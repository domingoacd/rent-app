const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', async (req, res, next) => {
    res.render('home');
    await database.query('INSERT INTO clients (full_name, license_number, phone_number) VALUES ("domingo2", 010101, 2123366)', (err, rows, fields) => {
        if (err) throw err;
    });
});

module.exports = router;