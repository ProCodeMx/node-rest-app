const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt')
const _ = require('underscore')
require('mongoose-pagination');

let data = [];
for (let k = 14; k <= 20; k++) {
    let user = {
        name: `Test ${k}`,
        email: `test${k}@gmail.com`,
        password: "manuel"
    };

    data.push(user);
}

app.get('/users', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    //User.find({}, 'name email')
    User.find({ state: true })
        .limit(limit)
        .skip(from)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: 'false',
                    err
                });
            }


            res.json({
                ok: 'true',
                users
            });
        })

});

app.post('/users', (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: 'false',
                err
            });
        }

        return res.json({
            ok: 'true',
            user: userDB
        });
    });

});

app.get('/users/seed', (req, res) => {
    for (user of data) {

        var newUser = new User(user);
        newUser.save((err, userDB) => {
            if (err) return res.status(400).json({ err });
            return res.send({ userDB })
        });

    }
})

app.put('/users/:id', (req, res) => {
    let userID = req.params.id;
    let body = _.pick(req.body, ['name',
        'email',
        'image',
        'state'
    ]);

    User.findByIdAndUpdate(userID, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: 'false',
                err,
                body
            });
        }

        return res.json({
            ok: 'true',
            user: userDB
        })
    })
});


app.delete('/users/:id', (req, res) => {
    let userID = req.params.id;

    User.findByIdAndUpdate(userID, { state: false }, { new: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: 'false',
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: 'false',
                err: {
                    message: 'User not found'
                }
            });
        }

        return res.json({
            ok: 'true',
            user: userDB
        });

    })
});

module.exports = app;