const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
    name: String,
    color: String,
    price: Number
});

const Flowers = mongoose.model('Flower', FlowerSchema);
module.exports = Flowers;