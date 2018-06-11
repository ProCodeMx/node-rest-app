const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');

app.get('/:type/:id', verifyTokenImg, (req, res) => {
    let type = req.params.type;
    let id = req.params.id;

    const validTypes = ['users', 'products'];
    const noImagePath = path.join(__dirname, '../assets/no-image.jpg');
    if (!validTypes.includes(type)) {
        res.sendFile(noImagePath);
    } else {
        const rootPath = path.join(__dirname, `../../uploads/${type}/${id}`);
        if (fs.existsSync(rootPath)) {
            res.sendFile(rootPath);
        } else {
            res.sendFile(noImagePath);
        }
    }


})

module.exports = app;