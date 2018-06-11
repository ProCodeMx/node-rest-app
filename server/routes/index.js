const express = require('express');
const app = express();


app.use('/users', require('./users'));
app.use(require('./login'));
app.use(require('./categories'));
app.use('/products', require('./products'));
app.use('/uploads', require('./uploads'));
app.use('/images', require('./images'));

module.exports = app;