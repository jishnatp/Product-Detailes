const express = require('express');
const mongoose = require('mongoose');
const Product = require('./Models/Product')
const bodyparser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
///////////////////////////////////Book Middleware


// connect to express app
const app = express()
const port = 3000;


app.use(express.json());
// app.use('/auth',router)
// connect to MongoDb

const client = new MongoClient('mongodb+srv://MERN-BOOK-APP:mernbook123@cluster0.osbgqv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
connectDB();



//middleware
app.use(bodyparser.json());
app.use(cors());
 



//insert product

//insert product
app.post('/insert', async (req, res) => {
  try {
    const { name, price, code, brand } = req.body; // Extract variables from req.body

    const db = client.db('test');
    const collection = db.collection('view');
    const duplicates = await collection.aggregate([
      { $group: { _id: '$code', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    if (duplicates.length > 0) {
      // For each duplicate, delete or update it to ensure uniqueness
      for (const duplicate of duplicates) {
        await collection.deleteMany({ code: duplicate._id });
      }
    }

    // Check if a product with the same code already exists
    const existingProduct = await collection.findOne({ code });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product code already exists' });
    }

    // Insert new product if code is unique
    const product = { name, price, code, brand };
    const result = await collection.insertMany([product]); // Wrap the product in an array

    if (result.insertedCount === 1) {
      res.status(201).json({ message: 'Product inserted successfully', product });
    } else {
      res.status(500).json({ error: 'Failed to insert product' });
    }
  } catch (err) {
    console.error('Error inserting product:', err);
    res.status(500).json({ error: 'Server error' });
  }
});




// Remove product
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = client.db('test');
    const collection = db.collection('view');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'product not found' });
    }
    res.status(200).json({ message: 'product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

// Get All products
app.get('/all-product', async (req, res) => {
  try {
    const db = client.db('test');
    const collection = db.collection('view');

    const allProducts = await collection.find().toArray();

    res.status(200).json(allProducts);
    console.log(allProducts);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})













 app.listen(port,()=>{
    console.log(`Port is runing on ${port}`);
})



 


