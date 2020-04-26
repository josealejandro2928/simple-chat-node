const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
const mongoDb = require('./utils/database');
const mongoose = require('mongoose');
const hooks = require('./hooks/index');
const app = express();
//////////////Set the app reference in the global node object /////////////////
global.app = {}
global.app.express = app;
global.mongoose = mongoose;
global.mongoose.Promise = require('bluebird');
global.models = {};
///////////////////////////////////////////////
app.use(compression());
app.use(cors({
    maxAge: 604800000
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

////////////RUNING HOOKS, REGISTRING ROUTES, GETTING MODELS, RUNINN TASKS////////////////
Promise.resolve().then(() => {
    return hooks.loadModules();
}).then(() => {
    console.log("Modelos cargados:")
    console.log(global.models)
    return;
}).then(() => {
    /*
    Put here some stuff that need to execute before Modules Registered and Models loaded
    */
    return;

}).catch(err => {
    console.log(err);
})

///////////////////////////////////////////////////////////


///////////////START THE SERVER ON DATABASE CONNECTION/////////////////////////////
mongoDb.connect().then(() => {
    console.log("Client Connected Succefully");
    app.listen(8080);
    console.log(`App start at ${new Date().toTimeString()}`);
    console.log("The app start succefully");
    // global.mongoose.set("debug", (collect, method, query, doc) => {
    //     console.log(`Collection: ${collect}, Method:${method}, Query: ${JSON.stringify(query)}`);
    // })

}).catch(error => {
    console.log("******************ERROR CONECTION MONGOOSE TO DB");
    console.log(error);
});