const Stock = require('../models/stock.model');
const Product = require('../models/product.model');


const AdjustStock = async (req, res) => {
    try {
        const { productId, storeId, quantity } = req.body;
        const product = await Product.findById(req.body.productId);
        console.log('Product found:', product);
        console.log(product.threshold);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        console.log('Adjusting stock for product:', productId, 'in store:', storeId, 'with quantity:', quantity);
        if(quantity < product.threshold){
            console.log('-------------')
            return res.status(400).json({ message: 'Stock quantity is below the threshold' });
            console.log('-------------')
        }
        console.log('Creating new stock entry with productId:', productId, 'storeId:', storeId, 'quantity:', quantity);
        const stock = new Stock({ productId, storeId, quantity });
        console.log('Stock instance created:', stock);
        await stock.save();
        res.status(201).json(stock);
    } catch (error) {
        console.error('Error adjusting stock:', error);
        res.status(400).json({ message: error.message });
    }
};

const getStock = async (req, res) => {
    try {
        const stock = await Stock.find().populate('productId', 'name sku').populate('storeId', 'name');
        res.status(200).json(stock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getStockById = async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id).populate('productId', 'name sku threshold').populate('storeId', 'name');
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.status(200).json(stock);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const transferStock = async (req, res) => {
    const session = await Stock.startSession();
    session.startTransaction();
    try {
        const { productId, fromStoreId, toStoreId, quantity } = req.body;
        if(!productId || !fromStoreId || !toStoreId || !quantity){
            return res.status(400).json({ message: 'Please provide productId, fromStoreId, toStoreId and quantity' });
        }
        const stockFrom = await Stock.findOne({ productId, storeId: fromStoreId });
        const product = await Product.findById(productId);
        if (!stockFrom || stockFrom.quantity < quantity || (stockFrom.quantity - quantity) < product.threshold ) {
            return res.status(400).json({ message: 'Insufficient stock in the source store' });
        }
        const sourceStore = await Stock.findOneAndUpdate(
            { productId, storeId: fromStoreId },
            { $inc: { quantity: -quantity } },
            { session , new: true }
        );

        if(!sourceStore){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Source store stock not found' });
        }
        
        await Stock.findOneAndUpdate(
            { productId, storeId: toStoreId },
            { $inc: { quantity: quantity } },
            { session , new: true, upsert: true }
        );
        await session.commitTransaction();
        res.status(200).json({ message: 'Stock transferred successfully' });
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });   
    }
};

module.exports = {
    AdjustStock,
    getStock,
    getStockById,
    transferStock
};