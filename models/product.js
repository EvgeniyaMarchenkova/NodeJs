const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    brand: String,
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL'],
    },
    color: String,
    price: {
        type: Number,
        min: 0
    }
});

const ProductModel = mongoose.model('Product', ProductSchema);

const product = new ProductModel({
    name: "Slim jeans",
    brand: "Wrangler",
    color: "navy",
    size: "XS"
});
product.save(function (err) {
    if (err) return console.error(err);
});

module.exports.Product = product;