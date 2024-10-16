const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
  
  imageUrl: {
     type: String, 
     required: false 
    }
});

module.exports = mongoose.model('Product', productSchema);
