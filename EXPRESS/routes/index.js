var express = require('express');
var router = express.Router();
const moment = require('moment')

/* GET home page. */

module.exports = function (db) {

  router.get('/', function (req, res, next) {
    db.query('SELECT * FROM tasks', (err, data) => {
      if (err) return res.send(err, 'error bang')
      res.render('list', { tasks: data.rows, moment })
    })
  });

  router.get('/add', function (req, res, next) {
    res.render('form')
  })


  router.post('/add', function (req, res, next) {
    const { string, integer, float, date, boolean } = req.body
    console.log(req.body)
    db.query('INSERT INTO tasks(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)', [string, integer, float, date, boolean], (err) => {
      if (err) return res.send(err, 'error bang')
      res.redirect('/')
    })
  })

  return router;
}