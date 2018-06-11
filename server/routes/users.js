const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
require('mongoose-pagination');

const { verifyToken, isAdmin } = require('../middlewares/authentication');


app.get('/', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find()
        .limit(limit)
        .skip(from)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                users
            });
        })

});



app.post('/', [verifyToken, isAdmin], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(201).json({
            ok: true,
            user: userDB
        });
    });

});

app.put('/:id', [verifyToken], (req, res) => {
    let userID = req.params.id;
    let body = _.pick(req.body, ['name',
        'email',
        'image',
        'state'
    ]);

    User.findByIdAndUpdate(userID, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        return res.json({
            ok: true,
            user: userDB
        });
    })
});


app.delete('/:id', [verifyToken, isAdmin], (req, res) => {
    let userID = req.params.id;

    User.findByIdAndUpdate(userID, { state: false }, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        return res.json({
            ok: true,
            user: userDB
        });

    })
});

module.exports = app;