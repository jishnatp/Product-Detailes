const mongoose=require("mongoose")
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true,unique: true },
  brand: { type: String, required: true },
  });

  
const Product = mongoose.model('Product', productSchema);

module.exports = Product;