const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const Contact = require('../models/contact');

router.use(express.urlencoded({ extended: true}));
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
 router.get('/contact', async (req, res) => {
  try {
    const contactMessages = await Contact.find();
    res.render('contact', { contactMessages });
  } catch (error){
    console.error("error fetching messages:", error);
    res.status(500).send('Error loading contact page.');
  }
 });

 router.post('/contact', async (req, res) => {
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
