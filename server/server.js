const express = require('express');
const app = express();
//const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
require('./config/config');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({ message: "Welcome to heroku" })
});

app.get('/users', (req, res) => {
    res.send("hello world")
});

app.post('/users', (req, res) => {
    let body = req.body;

    res.json({ body })
});

app.put('/users/:id', (req, res) => {
    res.json("put users")
});

app.delete('/users', (req, res) => {
    res.json("delete users")
});


app.listen(process.env.PORT, () => {
    console.log(`App Listening on port ${process.env.PORT}`);
})