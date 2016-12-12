var express = require('express');
var router = express.Router();

router.get('/login', function (req, res, next) {
   res.render('login.ejs', {quotes: null});
});

router.post('/login', function (req, res, next) {
  console.log("here")
  if (credentalsAreValid(req.body.username, req.body.password)) {
    req.session.isAuthenticated = true;
    res.send('Logged in as admin');
  } else {
    res.status(302);
    res.redirect('/login');
  }
});


module.exports = router;