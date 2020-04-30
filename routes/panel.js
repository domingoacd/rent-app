const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', (req, res, next) => {
  if (req.session.user_name) {
    res.render("panel", {
      user: req.session.user,
      user_name : req.session.user_name,
      approved_user : req.session.user_status == "approved",
      denied_user : req.session.user_status == "denied",
      pending_user : req.session.user_status == "pending"
    });
  } else {
    res.redirect('/signin');
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
  
router.route('/clients')
  .get(async (req, res, next) => {

    await database.query(`SELECT * FROM clients`, (err, result) => {
      if (err) {
        console.error(error);
      } else {

      }
      
      res.render('clients', {
        clients: result
      });

    });
  });

module.exports = router;