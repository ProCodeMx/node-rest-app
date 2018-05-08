const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/google', async(req, res) => {
    let id_token = req.body.id_token;

    if (!id_token) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "You must provide a token"
            }
        })
    }

    let googleUser = await verify(id_token)
        .catch((err) => {
            return res.status(400).json({
                ok: false,
                err
            })
        });


    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //Checar si el usuario no existe en la base de datos
        if (!userDB) {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                image: googleUser.image,
                password: '434537767657',
                googleAuth: true
            });
            user.save((err, userDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
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
                });
            });
        } else {
            // Ya existe, verificar si su login es local
            if (userDB.googleAuth == false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Your account is not linked to google, please link it"
                    }
                });
            }

            // Si su login es googleAuth darle un token
            let token = jwt.sign({
                user: userDB,
            }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

            return res.json({
                ok: true,
                user: userDB,
                token
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
        googleAuth: true
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