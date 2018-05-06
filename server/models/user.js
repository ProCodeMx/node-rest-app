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
        required: false,
        default: 'https://i1.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png?resize=256%2C256&quality=100'
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
        required: false,
        hide: true
    },
    googleAuth: {
        type: Boolean,
        default: false,
        hide: true
    },
    createdAt: {
        type: Date,
        default: new Moment(),
        hide: true
    }
});

/*userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}*/

userSchema.pre('save', function(next) {
    if (this.password) {
        var salt = bcrypt.genSaltSync(10)
        this.password = bcrypt.hashSync(this.password, salt)
    }
    next()
});

userSchema.plugin(uniqueValidator, { message: '{PATH} is already in use' });
userSchema.plugin(mongooseHidden, { hidden: { _id: false } })

module.exports = mongoose.model('User', userSchema)