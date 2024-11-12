const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const flowers = await Flower.find();

    res.render('index', { title: 'Flower Shop', flowers });
  } catch (error) {
    console.error("Error when fetching flowers:", error);
    next(error);
  }
  
});

module.exports = router;
