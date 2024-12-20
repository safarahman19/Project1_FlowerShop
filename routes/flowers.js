const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
let indexController = require('../controller/index');
let mongoose = require('mongoose');
let passport = require('passport');

router.get('/', requireAuth, async (req, res) => {
    try {
        const flowers = await Flower.find();
        res.render('flowers/index', {
            title: 'Flower',
            flowers:flowers
        });
    }catch (err) {
        res.status(500).send('Error getting flowers: ' + err);
    }
});

router.get('/new', requireAuth, (req, res) => {
    res.render('flowers/new', {title: "Add Flower"});
});

router.post('/', requireAuth, async (req, res) => {
    const { name, color, price, quantity } = req.body;

    if (!name || !color || !price || !quantity) {
        return res.status(400).send('All fields are required');
    }
    try {
        await Flower.create({ name, color, price, quantity });
        res.redirect('/flowers');
    } catch (err) {
        res.status(500).send('Error adding flowers' + err);
    }
});

router.get('/:id/edit', requireAuth, async (req, res) => {
    try {
        const flower = await Flower.findById(req.params.id);
        if (!flower) {
            return res.status(404).send('Flower not found');
        }
        res.render('flowers/edit', { title: 'Edit flower', flower });
    }   catch (error) {
        console.error('Error retrieving flower for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/:id/edit', async (req, res) => {
    const { name, color, price, quantity } = req.body;
    try {
        const updatedFlower = await Flower.findByIdAndUpdate(
            req.params.id, 
            { name, color, price, quantity},
            {new: true}
        );
        if (!updatedFlower) {
            return res.status(404).send('Flower not found');
        }
        res.redirect('/flowers');
    } catch (error) {
        console.error('Error updating flower:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete/:id', requireAuth, async (req, res) => {
    try {
        const flowerId = req.params.id;
        await Flower.findByIdAndDelete(flowerId);
        res.redirect('/flowers');
    }   catch (error) {
        console.error("Error deleting your flower:", error);
        res.status(500).send("internal Server Error");
    }
});

router.get('/',(req, res) => {
    console.log('User object:', req.user);
    const displayName = req.user ? req.user.displayName : null;
    res.render('index', { title: 'FLower Shop', displayName });
    console.log('Display Name:', displayName);
  });
  
function requireAuth(req,res, next)
  {
    if(req.isAuthenticated())
    {
      return res.redirect('/login');
    }
    next();
  }
  // get router for login page
router.get('/login',indexController.displayLoginPage);
  // post router for login page
router.post('/login',indexController.processLoginPage);
  
  // get router for Registration page
router.get('/register',indexController.displayRegisterPage);
  // post router for Registration page
router.post('/register',indexController.processRegisterPage);
  // get router for Logout page
router.get('/logout',indexController.performLogout);
  
  
module.exports = router;
