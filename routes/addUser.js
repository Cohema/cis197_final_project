var express = require('express');
var router = express.Router();

router.get('/addUser', function (req, res, next) {
   res.render('addUser.ejs', {quotes: null});
});

router.post('/addUser', function (req, res, next) {
  if (credentalsAreValid(req.body.username, req.body.password)) {
    req.session.isAuthenticated = true;
    res.send('Logged in as admin');
  } else {
    res.status(302);
    res.redirect('/login');
  }
});


module.exports = router;