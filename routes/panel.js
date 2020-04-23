const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', (req, res, next) => {
  if (req.session.user_name) {
    res.render("panel", {
      user_name : req.session.user_name,
      approved_user : req.session.user_status == "approved",
      denied_user : req.session.user_status == "denied",
      pending_user : req.session.user_status == "pending"
    });
  } else {
    res.render('signin');
  }
});

router.route('/cars')
  .get(async (req, res, next) => {
    await database.query(`SELECT * FROM cars`, (err, result) => {
      if (err) {

      } else {
        
        res.render("cars", {cars: result});
      }
    }); 
  });
module.exports = router;