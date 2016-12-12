const express = require('express')
const bodyParser= require('body-parser')
var bb = require('express-busboy')
const busboyBodyParser = require('busboy-body-parser');
const app = express();
var session = require('client-sessions');
var busboy = require('connect-busboy');

// var login = require('./routes/login');
// var addUser = require('./routes/addUser');
// var mongo = require('./mongo');



var MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://cis197:cis197@ds133158.mlab.com:33158/modcon', (err, database) => {
  if (err) {
    return console.log(err)
  }
  db = database;
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

// bb.extend(app, {
//     upload: true,
//     path: '~/Code/CIS197/final_proj/files',
//     allowedPath: /./
// });


app.use(bodyParser.urlencoded({extended: true}))
// app.use(busboyBodyParser({ limit: '5mb' }));
// app.use(busboy());

app.use(session({
  cookieName: 'session',
  secret: 'itsasecret',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
app.set('view engine', 'ejs')
// app.use('/', login);
// app.use('/', addUser);

// var credentalsAreValid = function(username, password){
//   db.collection('users').find().toArray( function(err, result){
//     console.log(result);
//   })
// }


app.get('/', (req, res) => {
  db.collection('bills').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {bills: result, user: req.session.user})
  })
})

app.post('/quotes', (req, res) => {
  console.log(req.body.name);
    db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

//login
app.get('/login', function (req, res, next) {
   res.render('login.ejs', {failed: false});
});
app.get('/login_fail', function (req, res, next) {
   res.render('login.ejs', {failed: true});
});

app.post('/login*', function (req, res, next) {
  // console.log(db.collection('users').find({username:req.body.username})).toArray(function(err, result){
  //   console.log(result)
  // });
  db.collection('users').find().toArray( function(err, result){
    var exists = false
    var level = 0;
    for (i = 0; i < result.length; i++){
      if (result[i].username === req.body.username && result[i].password === req.body.password){
        exists = true;
        level = result[i].level;
        break;
      }
    }
    if (exists) {
      console.log('Logged in as: ' + req.body.username + 'Permission level: ' + level);
      req.session.user = [req.body.username, level];
      res.redirect('/');
    } else {
      res.status(302);
      res.redirect('/login_fail');
    }
  })
});

//addfiles
app.post('/files', (req, res) => {
  console.log(req.files)
  console.log(req.files)
    // db.collection('bills').save(req.body, (err, result) => {
    // if (err) return console.log(err)
    // console.log('saved to database')
  res.redirect('/')
  // })
})

//logout
app.get('/logout', function (req, res, next) {
  req.session.user = null;
  res.redirect('/');
});

//adduser
app.get('/addUser', function (req, res, next) {
   res.render('addUser.ejs');
});

app.post('/addUser', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('user saved to database')
    res.redirect('/')
  })
})

//bills
app.get('/billwrite', function (req, res, next) {
  res.render('bill.ejs', {number: req.session.billinfo.number});
});


app.post('/billwrite', (req, res) => {
    var billinfo = Object.assign({}, req.session.billinfo, req.body, {upvotes: '0'})
    // console.log(billinfo);
    db.collection('bills').save(billinfo, (err, result) => {
    if (err) return console.log(err)
    console.log('bill body saved to database')
    res.redirect('/');
  })
})

app.post('/bill', (req, res) => {
  console.log('bill info saved to session')
  req.session.billinfo = req.body;
  res.redirect('/billwrite');
})

//delete
app.post('/delete', (req, res) => {
    // console.log(billinfo);
    db.collection('bills').remove({$and:
      [{ aname: req.body.author },
      { bname: req.body.bill }]
    })
    console.log('bill deleted')
    res.redirect('/');
})

// read
app.post('/read', (req, res) => {
    db.collection('bills').find(
      {$and:
      [{ aname: req.body.author },
      { bname: req.body.bill }]
    }
    ).toArray( function(err, result){
     res.render('readbill.ejs', {billinfo: result});
    })
})

//upvote
app.post('/upvote', (req, res) => {
    db.collection('bills').find(
      {$and:
      [{ aname: req.body.author },
      { bname: req.body.bill }]
    }
    ).toArray( function(err, result){
      // console.log(result);
      // console.log(result['upvotes']);
      // console.log(parseInt(result.upvotes) + 1);
      db.collection('bills').update(
        {$and:
        [{ aname: req.body.author },
        { bname: req.body.bill }]
      }, {$set: {upvotes: parseInt(result[0].upvotes) + 1}});
      res.redirect('/');
    })

})



