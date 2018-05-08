const express = require('express');
const app = express();
const Category = require('../models/category');
const _ = require('underscore');

const { verifyToken, isAdmin } = require('../middlewares/authentication');


app.get('/categories', verifyToken, (req, res) => {
    var query = Category.find({});
    var promise = query
        .sort('name')
        .populate('user', 'name email')
        .exec();

    promise.catch((err) => {
        return res.status(400).json({
            ok: false,
            err
        });
    });

    promise.then((categories) => {
        return res.json({
            ok: true,
            categories
        });
    });
});


app.post('/categories', verifyToken, async(req, res) => {
    let body = req.body;
    let user = req.user._id;

    let category = new Category({
        name: body.name,
        user
    });

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }


        res.status(201).json({
            ok: true,
            category: categoryDB
        })

    })
});

module.exports = app;