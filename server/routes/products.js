const express = require('express');
const app = express();
const Product = require('../models/product');
const _ = require('underscore');

const { verifyToken, isAdmin } = require('../middlewares/authentication');


app.get('/search/:term', verifyToken, (req, res) => {
    let term = req.params.term;
    let regex = new RegExp(term, 'i');

    var query = Product.find({ name: regex });
    var promise = query.populate('user', 'name').populate('category', 'name').exec();

    promise.catch((err) => {
        return res.status(400).json({
            ok: false,
            err
        });
    });

    promise.then((products) => {
        return res.json({
            ok: true,
            products
        });
    });
});

app.get('/', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let to = req.query.to || 10;
    to = Number(to);
    // stock: { $gt: 0 }
    var query = Product.find({});

    var promise = query
        .populate('user', 'name')
        .populate('category', 'name')
        .skip(from)
        .limit(to)
        .sort('name')
        .exec();

    promise.catch((err) => {
        return res.status(400).json({
            ok: false,
            err
        });
    });

    promise.then((products) => {
        return res.json({
            ok: true,
            products
        });
    });
});


app.post('/', verifyToken, async(req, res) => {
    let body = req.body;
    let user = req.user._id;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        stock: body.stock,
        category: body.category,
        user
    });

    product.save((err, productDB) => {
        err ? res.status(400).json({ ok: false, err }) : res.status(201).json({ ok: true, product: productDB });
    });
});

module.exports = app;