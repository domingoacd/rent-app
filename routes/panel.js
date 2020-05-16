const express = require('express');
const router = express.Router();
const util = require('util');
const database = require('../database/connect');

router.get('/', async (req, res, next) => {
  const query = util.promisify(database.query).bind(database);

  let rentals = null;
  if (req.session.user_name) {
    rentals = await query(`
      SELECT * 
      FROM rents
      JOIN cars ON rents.car_id = cars.id
      JOIN clients ON rents.client_id = clients.id
    `);
    console.log(rentals);
    res.render("panel", {
      user: req.session.user,
      user_name : req.session.user_name,
      approved_user : req.session.user_status == "approved",
      denied_user : req.session.user_status == "denied",
      pending_user : req.session.user_status == "pending",
      rentals: rentals
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