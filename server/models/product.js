const mongoose = require('mongoose');
const Moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    stock: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });


productSchema.plugin(uniqueValidator, { message: '{PATH} is already in use' });
module.exports = mongoose.model('Product', productSchema);