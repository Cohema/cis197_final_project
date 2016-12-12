var MongoClient = require('mongodb').MongoClient
var db;

MongoClient.connect('mongodb://cis197:cis197@ds133158.mlab.com:33158/modcon', (err, database) => {
  if (err) {
    return console.log(err)
  }
  db = database;
})

function start (callback) {
  callback();
}

module.exports = {
  start: start,
  db: db
};