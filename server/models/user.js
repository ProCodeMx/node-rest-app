const mongoose = require('mongoose');
const Moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const mongooseHidden = require('mongoose-hidden')()


const Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const valid_roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
};

let validateEmail = function(email) {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: [true, 'Email is already in use'],
        trim: true,
        lowercase: true,
        required: [true, 'Email is required'],
        validate: [validateEmail, '{VALUE} is not a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        hide: true
    },
    image: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: valid_roles,
        required: false,
        uppercase: true
    },
    state: {
        type: Boolean,
        default: true,
        required: false
    },
    googleAuth: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Moment()
    }
});

/*userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}*/

userSchema.plugin(uniqueValidator, { message: '{PATH} is already in use' });
userSchema.plugin(mongooseHidden)

module.exports = mongoose.model('User', userSchema)