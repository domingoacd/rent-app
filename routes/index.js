const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', async (req, res, next) => {
    res.render('home');
});
router.get('/signup', (req, res, next) => {
    res.render('signup');
});
module.exports = router;