const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


require('./config/config');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// ROUTES
app.use(require('./routes/index'));


app.get('/', (req, res) => {
    res.json({ message: "Welcome to heroku" })
});




// ================================
//           CONEXIONES
// ================================
mongoose.connect(process.env.MONGOURLDB, (err) => {
    if (err) throw new Error(`No se pudo conectar a la base de datos`)

    console.log(`Connection Successfull`);
});

app.listen(process.env.PORT, () => {
    console.log(`App Listening on port ${process.env.PORT}`);
})