var express = require('express');
var router = express.Router();

/* GET home page. */

module.exports = function (db) {

  router.get('/', function (req, res, next) {
    db.query('SELECT * FROM tasks', (err, data) => {
      if (err) return res.send(err, 'error bang')
      res.render('list', { tasks: data.rows })
    })
  });

  return router;
}