const Store = require('../models/store.model');

const createStore = async (req, res) => {
    try {
        console.log('Creating store with data:', req.body);
        const { name, location } = req.body;
        console.log('Store data:', { name, location });
        const store = new Store({ name, location });
        console.log('Store instance created:', store);
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(400).json({ message: error.message });
    }
};

const getStores = async (req, res) => {
    try {
        const stores = await Store.find();
        res.status(200).json(stores);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getStoreById = async (req, res) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateStore = async (req, res) => {
    try {
        const { name, location } = req.body;   
        const store = await Store.findByIdAndUpdate(req.params.id, { name, location }, { new: true });
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteStore = async (req, res) => {
    try {
        const store = await Store.findByIdAndDelete(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createStore,
    getStores,
    getStoreById,
    updateStore,
    deleteStore
};