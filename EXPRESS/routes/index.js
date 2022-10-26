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
    res.render('form',{item: {}, moment})
  })


  router.post('/add', function (req, res, next) {
    const { string, integer, float, date, boolean } = req.body
    console.log(req.body)
    db.query('INSERT INTO tasks(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)', [string, integer, float, date, boolean], (err) => {
      if (err) return res.send(err, 'error bang')
      res.redirect('/')
    })
  })

  router.get('/edit/:id', function (req, res, next) {
    db.query('SELECT * FROM tasks WHERE id =$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.send(err, 'error bang')
      if(data.rows.length == 0)return res.send(err, 'data not found')
      res.render('form', {item: data.rows[0], moment })
    })
  });

  router.post('/edit/:id', function (req, res, next) {
    const { string, integer, float, date, boolean } = req.body
    console.log(req.body)
    db.query('UPDATE tasks SET string = $1, integer = $2, float = $3, date = $4, boolean = $5, id = $6  ', [string, integer, float, date, boolean, Number(req.params.id)], (err) => {
      if (err) return res.send(err, 'error bang')
      res.redirect('/')
    })
  })

  router.get('/delete/:id', function (req, res, next) {
    db.query('DELETE FROM tasks WHERE id =$1', [Number(req.params.id)], (err) => {
      if (err) return res.send(err, 'error bang')
      res.redirect('/')
    });
  });


  return router;
}