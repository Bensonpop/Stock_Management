const {Schema, model} = require('mongoose');

const stockSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    }
}, {
    timestamps: true
});

stockSchema.index({ productId: 1, storeId: 1 }, { unique: true });
module.exports = model('Stock', stockSchema);