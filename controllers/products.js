const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const list = await Product.find();
    res.status(200).json(list);
  } catch {
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(p);
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid product ID' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newP = new Product(req.body);
    await newP.save();
    res.status(201).json(newP);
  } catch {
    res.status(400).json({ message: 'Invalid product data' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!p) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(p);
  } catch {
    res.status(400).json({ message: 'Invalid update data' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const del = await Product.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    const status = err.kind === 'ObjectId' ? 400 : 500;
    res.status(status).json({ message: 'Invalid product ID' });
  }
};
