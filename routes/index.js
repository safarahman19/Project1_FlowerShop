const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Contact = require('../models/contact');
const methodOverride = require('method-override');
let indexController = require('../controller/index');
let mongoose = require('mongoose');
let passport = require('passport');

router.use(express.urlencoded({ extended: true}));
router.use(methodOverride('_method'));
/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    const flowers = await Flower.find();
    const displayName = req.user ? req.user.displayName : null;
    res.render('index', { title: 'Flower Shop', flowers, displayName});
  } catch (error) {
    console.error("Error when fetching flowers:", error);
    next(error);
  }
});

router.get('/flowerslist/add', requireAuth, async (req, res) => {
  res.render('addFlower', {title: 'Add a New Flower' });
});

router.post('/flowerslist/add', requireAuth, async (req, res) => {
  const {Name, Color, Price, Quantity } = req.body;
  const newFlower = new Flower({
    Name,
    Color,
    Price,
    Quantity
  });

  try {
    await newFlower.save();
    res.redirect('/');
  } catch (err) {
    console.error('Error saving flower', err);
    res.status(500).send('Error saving flower.');
  }
});

router.get('/flowerslist/edit/:id',requireAuth, async  (req, res) => {
  const flowerId = req.params.id;
  try {
    const flower = await Flower.findById(flowerId);
    if (!flower) {
      return res.status(404).send('Flower not found.');
    }
    res.render('flowers/edit', {title: 'Edit Flower', flower});
  } catch (err) {
    console.error('Error getting flowers:', err);
    res.status(500).send('Error getting flower details.');
  }
});
//update existing flowers
router.post('/flowerslist/edit/:id', requireAuth, async (req, res) => {
  const { Name, Color, Price, Quantity} = req.body;
  try {
    const updatedFlower = await Flower.findByIdAndUpdate(req.params.id, {
      Name,
      Color,
      Price,
      Quantity
    }, {new: true});

    if (!updatedFlower) {
      return res.status(404).send('Flower not Found.');
    }
    res.redirect('/');
  } catch (err) {
    console.error("Error updating flower", err);
    res.status(500).send('Error updated flower.');
  }
});
//Delete flower
router.get('/flowerslist/delete/:id',requireAuth, async (req, res) => {
  try {
    const deletedFlower = await Flower.findByIdAndDelete(req.params.id);
    if (!deletedFlower) {
      return res.status(404).send('Flower not found.');
    }
    res.redirect('/flowers/list');
  } catch (err) {
      console.error("error deleting flower:", err);
      res.status(500).send('Error deleting flower.');
  }
});

 router.get('/contact', async (req, res) => {
  try {
    const contactMessages = await Contact.find();
    res.render('contact', { contactMessages });
  } catch (error){
    console.error("error fetching messages:", error);
    res.status(500).send('Error loading contact page.');
  }
 });

 router.put('/contact', async (req, res) => {
  const {name, email, message } = req.body;
  const newContact = new Contact({
    name, 
    email,
    message
  });
 
 try {
  await newContact.save();
  res.redirect('/contact');
 } catch (err) {
  console.error("Error saving your contact message:", err);
  res.status(500).send('Error saving your message.');

 }
});


function requireAuth(req,res, next)
{
  if(!req.isAuthenticated())
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
