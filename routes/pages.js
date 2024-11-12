const express = require('express');
const router = express.Router();

//Home page
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/about', (req, res) => {
    res.render('about us');
});

router.get('/contact', (req, res) => {
    res.render('contact us');
});

module.exports = router;

