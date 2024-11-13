const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
    Name: {type: String, required: true },
    Color: {type: String, required: true },
    Price: {type: Number, required: true },
    Quantity: {type: Number, required: true },
});

module.exports = mongoose.model('Flower', flowerSchema);
