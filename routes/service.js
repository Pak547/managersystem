const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');
const checkRole = require('../services/checkRole');

router.post('/add', auth.authenticateToken, checkRole.checkRole(req, res, next), (req, res) => {
  query = "INSERT INTO category (category_name) VALUES (?)";
  connection.query(query, [req.body.category_name], (err, results) => {
    try {
      return res.status(200).json({ message: "Successfully Added" });
    } catch {
      return res.status(500).json(err);
    }
  })
});

router.get('/get', auth.authenticateToken,(req, res, next) => {
    const query = "SELECT * FROM category ORDER BY NAME ASC";
    connection.query(query, (err, results) => {
      try {
        return res.status(200).json(results);
      } catch {
        return res.status(500).json(err);
      }
    });
  });

  router.patch('/update', auth.authenticateToken, checkRole.checkRole(req, res, next), (req, res) => {
    const product = req.body;
    const query = "UPDATE category SET category_name = ? WHERE category_id = ?";
    connection.query(query, [category.category_name, category.category_id], (err, results) => {
      try {
        if(results.affectedRows === 0){  
          return res.status(404).json({ message: "ID not found" });
        }
        else {
          return res.status(200).json({ message: "Category Updated Successfully" });
        }
      } catch {
        return res.status(500).json(err);
      }
    });
  });

  module.exports = router;