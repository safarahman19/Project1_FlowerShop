const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');

router.get('/', async (req, res) => {
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

router.get('/new', (req, res) => {
    res.render('flowers/new', {title: "Add Flower"});
});

router.post('/', async (req, res) => {
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

router.get('/:id/edit', async (req, res) => {
    const flower = await Flower.findById(req.params.id);
    res.render('flowers/edit', {flower });
});

router.post('/:id', async (req, res) => {
    const { name, description, price } = req.body;
    await Flower.findByIdAndUpdate(req.params.id, { name, description, price});
    res.redirect('/flowers');
});

router.post('/:id/delete', async (req, res) => {
    await Flower.findByIdAndDelete(req.params.id);
    res.redirect('/flowers');
});

module.exports = router;
