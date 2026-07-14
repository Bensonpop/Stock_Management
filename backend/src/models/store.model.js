const {Schema, model} = require('mongoose');

const storeSchema = new Schema({
    name: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    location: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

module.exports = model('Store', storeSchema);