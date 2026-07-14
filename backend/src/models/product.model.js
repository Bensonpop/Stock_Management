const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true, 
    trim: true
  },
  quantity: {
    type: Number,
    required: true,   
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  threshold: {
    type: Number,
    default: 10, 
    min: [0, 'Threshold cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = model('Product', productSchema);