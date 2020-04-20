const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');

const app = express();

app.use(compression());
app.use(cors({
    maxAge: 604800000
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

////////////REGISTRING ROUTES////////////////

const feedRoutes = require('./routes/feed');

/////////////////////////////////////////////
/////////////USING THE ROUTES////////////
app.use(feedRoutes);
//////////////////////////////////////
app.listen(8080);

console.log("The app start succefully");