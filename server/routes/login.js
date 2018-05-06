const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/google', async(req, res) => {
    let token_id = req.body.idtoken;

    if (!token_id) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "You can't login with normal authentication"
            }
        })
    }

    let googleUser = await verify(token_id)
        .catch((err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }
        // Si el email ya existe con login local
        if (userDB) {
            if (userDB.google == false) {
                return res.status(400).json({
                    err: {
                        message: "Your email already exists with local login"
                    }
                });
            } else {
                // Si el usuario ya existe con login google
                let token = jwt.sign({
                    user: userDB,
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }
        } else {
            // Si el usuario no existe en la base de datos
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                image: googleUser.image,
                google: googleUser.google,
                password: '914u1090123'
            });
            // Lo guardamos en la base de datos
            user.save((err, userDB) => {
                if (err) {
                    return res.status(500).json({
                        err
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
            })
        }
    });

});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
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