const express = require('express');
const router = express.Router();
const database = require('../database/connect');

router.get('/', (req, res, next) => {
  console.log(req.session);
  res.render("dashboard", {
    approved_user : req.session.user_status == "approved",
    denied_user : req.session.user_status == "denied",
    pending_user : req.session.user_status == "pending"
  });
});
module.exports = router;