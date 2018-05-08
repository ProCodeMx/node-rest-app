const mongoose = require('mongoose');
const Moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: [true, 'That category already exists']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });


categorySchema.plugin(uniqueValidator, { message: '{PATH} is already in use' });
module.exports = mongoose.model('Category', categorySchema);