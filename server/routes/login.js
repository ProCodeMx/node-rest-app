const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                err
            });
        }

        if (!userDB) {
            return res.status(500).json({
                err: {
                    message: 'Email incorrect'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                err: {
                    ok: false,
                    message: 'Password incorrect'
                }
            });
        }

        let token = jwt.sign({
            user: userDB,
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        return res.json({
            ok: true,
            user: userDB,
            token
        })
    });

});

module.exports = app;