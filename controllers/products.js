const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch {
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid product ID' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch {
    res.status(400).json({ message: 'Invalid update data' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid product ID' });
  }
};