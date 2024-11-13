const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Contact = require('../models/contact');
const methodOverride = require('method-override');

router.use(express.urlencoded({ extended: true}));
router.use(methodOverride('_method'));
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

router.get('/flowerslist/add', async (req, res) => {
  res.render('addFlower', {title: 'Add a New Flower' });
});

router.post('/flowerslist/add', async (req, res) => {
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

router.get('/flowerslist/edit/:id', async  (req, res) => {
  const flowerId = req.params.id;
  try {
    const flower = await Flower.findById(flowerId);
    if (!flower) {
      return res.status(404).send('Flower not found.');
    }
    res.render('editFlower', {title: 'Edit Flower', flower});
  } catch (err) {
    console.error('Error getting flowers:', err);
    res.status(500).send('Error getting flower details.');
  }
});
//update existing flowers
router.post('/flowerslist/edit/:id', async (req, res) => {
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
router.get('/flowerslist/delete/:id', async (req, res) => {
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

module.exports = router;
