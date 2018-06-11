const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');

// default options
app.use(fileUpload());

app.put('/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    //Validate type
    let validTypes = ['products', 'users'];

    if (!validTypes.includes(type)) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `You can only upload files for ${validTypes.join(', ')}`
            }
        });
    }

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were selected.'
            }
        });

    let file = req.files.file;
    const validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];

    if (!validExtensions.includes(file.mimetype)) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Only ${validExtensions.join(', ')} are accepted`
            }
        });
    }

    //Rename file name
    file.name = `${id}-${new Date().getMilliseconds()}.${file.mimetype.split("/")[1]}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv((`./uploads/${type}/${file.name}`), (err) => {
        if (err)
            return res.status(500).json({ ok: false, err });


        // Imagen cargada
        if (type == 'users') {
            userImage(id, res, file.name);
        } else {
            productImage(id, res, file.name);
        }
    });
});

const userImage = (userId, res, fileName) => {

    User.findById(userId, (err, userDB) => {
        if (err) {
            deleteImage(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User not found"
                }
            });
        }

        deleteImage(fileName, 'users');

        userDB.image = fileName;

        userDB.save((err, userDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                userDB,
                image: fileName
            });
        })


    });
}

const productImage = (productId, res, fileName) => {

    Product.findById(productId, (err, productDB) => {
        if (err) {
            deleteImage(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            deleteImage(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Product not found"
                }
            });
        }

        deleteImage(fileNamed, 'products');
        productDB.image = fileName;

        productDB.save((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.status(200).json({
                ok: true,
                productDB,
                image: fileName
            });
        })


    });
}


const deleteImage = (fileName, type) => {
    let pathUrl;
    if (type == 'users') {
        pathUrl = path.resolve(__dirname, `../../uploads/users/${fileName}`);
    } else {
        pathUrl = path.resolve(__dirname, `../../uploads/products/${fileName}`);
    }

    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }
}

module.exports = app;