const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Stock = require('../models/stock.model');
const Store = require('../models/store.model');

const createProduct = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, description, sku, quantity, storeId, threshold } = req.body;
        const product = new Product({ name, description, sku, quantity, storeId, threshold });
        await product.save();
        const stock = new Stock({ productId: product._id, storeId, quantity });
        await stock.save();
        await session.commitTransaction();
        res.status(201).json(product);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    const session = await mongoose.startSession();  
    try {
        session.startTransaction();
        const { name, description, sku, quantity, storeId, threshold } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { name, description, sku, quantity, storeId, threshold }, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const stock = await Stock.findOneAndUpdate({ productId: product._id, storeId }, { quantity }, { new: true });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        await session.commitTransaction();
        res.status(200).json(product);
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

const deleteProduct = async (req, res) => {
    const session = await mongoose.startSession();  
    try {
        session.startTransaction();
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await Stock.deleteMany({ productId: product._id });
        await session.commitTransaction();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};