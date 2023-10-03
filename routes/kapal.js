const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

router.get('/', function (req, res) {
  connection.query(
    'SELECT k.nama_kapal, q.nama_dpi, d.luas, p.nama_pemilik, a.nama_alat FROM kapal as k INNER JOIN dpi as q ON k.id_dpi = q.id_dpi INNER JOIN dpi as d ON k.id_dpi = d.id_dpi INNER JOIN pemilik as p ON k.id_pemilik = p.id_pemilik INNER JOIN alat_tangkap as a ON k.id_alat= a.id_alat',
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'server  error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'data kapal',
          data: rows[0],
        });
      }
    }
  );
});

router.post('/store', [body('nama_kapal').notEmpty(), body('id_pemilik').notEmpty(), body('id_dpi').notEmpty(), body('id_alat').notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({
      error: error,
    });
  }
  let data = {
    nama_kapal: req.body.nama_kapal,
    id_pemilik: req.body.id_pemilik,
    id_dpi: req.body.id_dpi,
    id_alat: req.body.id_alat,
  };
  connection.query('insert into kapal set ?', data, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server error',
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'data kapal berhasil dibuat',
        data: rows[0],
      });
    }
  });
});

router.get('/(:id)', function (req, res) {
  let id = req.params.id;
  connection.query(
    'SELECT k.nama_kapal, q.nama_dpi, d.luas, p.nama_pemilik, a.nama_alat FROM kapal as k INNER JOIN dpi as q ON k.id_dpi = q.id_dpi INNER JOIN dpi as d ON k.id_dpi = d.id_dpi INNER JOIN pemilik as p ON k.id_pemilik = p.id_pemilik INNER JOIN alat_tangkap as a ON k.id_alat= a.id_alat',
    function (err, rows) {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'server error',
        });
      }
      if (rows.length <= 0) {
        return res.status(400).json({
          status: false,
          message: 'not found',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'data ada',
          data: rows[0],
        });
      }
    }
  );
});

router.patch('/update/:id', [body('nama_kapal').notEmpty(), body('id_dpi').notEmpty(), body('id_pemilik').notEmpty(), body('id_alat').notEmpty()], (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      error: error.array(),
    });
  }
  let id = req.params.id;
  let data = {
    nama_kapal: req.body.nama_kapal,
    id_dpi: req.body.id_dpi,
    id_pemilik: req.body.id_pemilik,
    id_alat_tangkap: req.body.id_alat_tangkap,
  };
  connection.query(`update kapal set ? where id_kapal = ${id}`, data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server error',
        error: err,
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'update data kapal',
      });
    }
  });
});

router.delete('/delete/:id', function (req, res) {
  let id = req.params.id;
  connection.query(`delete from kapal where id_kapal = ${id}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'server error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'hapus data kapal',
      });
    }
  });
});

module.exports = router;
