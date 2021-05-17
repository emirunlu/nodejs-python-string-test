require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');

const app = express();

// FILE UPLOAD

require('./config/sequelize');

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}
app.use(cors());

app.use('/public', express.static(__dirname + '/logo'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//Routes
require('./routes/pycalc.routes')(app);

const port = process.env.PORT || 5000;  //process.env.port is Heroku's port if you choose to deplay the app there
app.listen(port, () => console.log("Server up and running on port " + port));