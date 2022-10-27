var express = require('express');
var router = express.Router();
const moment = require('moment')

/* GET home page. */

module.exports = function (db) {

  router.get('/', function (req, res) {

    const url = req.url == '/' ? '/?page=1' : req.url
    let params = []
    let values = []
    let count  = 1

    
    if (req.query.id && req.query.idCheck == 'on') {
      params.push(`id = $${count++}`);
      values.push(req.query.id);
  }

  if (req.query.string && req.query.stringCheck == 'on') {
      params.push(`string ilike '%' || $${count++} || '%'`);
      values.push(req.query.string);
  }

  if (req.query.integer && req.query.intCheck == 'on') {
      params.push(`integer = $${count++}`)
      values.push(req.query.integer);
  }

  if (req.query.float && req.query.floatCheck == 'on') {
      params.push(`float = $${count++}`)
      values.push(req.query.float);
  }

  if (req.query.dateCheck == 'on') {
      if (req.query.fromdate && req.query.todate  ) {
          params.push(`date BETWEEN $${count++} AND $${count++}`)
          values.push(req.query.fromdate);
          values.push(req.query.todate);
      }
      else if (req.query.fromdate) {
          params.push(`date > $${count++}`)
          values.push(req.query.fromdate);
      }
      else if (req.query.todate) {
          params.push(`date < $${count++}`)
          values.push(req.query.todate);
      }
  }

  if (req.query.boolean && req.query.booleanCheck == 'on') {
      params.push(`boolean = $${count++}`);
      values.push(req.query.boolean);
  }

    let page = req.query.page || 1
    page = Number(page)
    const limit = 3
    const offset = (page - 1) * limit

    let sql = 'SELECT count (*) AS total FROM tasks';

    if (params.length > 0) {
      sql += ` WHERE ${params.join(' AND ')}`
    }

    db.query(sql, values, (err, data) => {
      if (err) return res.send(err, 'error bang')

      const total = data.rows[0].total
      const pages = Math.ceil(total / limit)

      sql = 'SELECT * FROM tasks'
      if (params.length > 0) {
        sql += ` WHERE ${params.join(' AND ')}`
      }

      sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`

      db.query(sql, [...values, limit, offset], (err, data) => {
        if (err) return res.send(err)
        res.render('list', {
          tasks: data.rows,
          moment,
          page,
          pages,
          offset,
          query: req.query,
          url
        })
      })
    });

  })

  router.get('/add', function (req, res, next) {
    res.render('form', { item: {}, moment })
  })


  router.post('/add', function (req, res, next) {
    const { string, integer, float, date, boolean } = req.body
    db.query('INSERT INTO tasks(string, integer, float, date, boolean) values ($1, $2, $3, $4, $5)', [string, integer, float, date, boolean], (err) => {
      if (err) return res.send(err, 'error bang')
      res.redirect('/')
    })
  })

  router.get('/edit/:id', function (req, res, next) {
    db.query('SELECT * FROM tasks WHERE id =$1', [Number(req.params.id)], (err, data) => {
      if (err) return res.send(err, 'error bang')
      if (data.rows.length == 0) return res.send(err, 'data not found')
      res.render('form', { item: data.rows[0], moment })
    })
  });

  router.post('/edit/:id', function (req, res, next) {
    const { string, integer, float, date, boolean } = req.body
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