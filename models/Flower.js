const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
    name: {type: String, required: true },
    color: {type: String, required: true },
    price: {type: Number, required: true },
    quantity: {type: Number, required: true },
});

const Flowers = mongoose.model('Flower', FlowerSchema);
module.exports = Flowers;