const PORT = 8080;
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
const mongoDb = require('./utils/database');
const mongoose = require('mongoose');
const hooks = require('./hooks/index');
const path = require('path');
const processImageUpload = require('./middleware/processImageUploads');

const mailTransporter = require('./mail/index');
global.mailer = {
  transporter: mailTransporter,
  mailAddress: 'tienda@peoplegoto.com',
};

const app = express();
//////////////Set the app reference in the global node object /////////////////
global.app = {};
global.app.express = app;
global.mongoose = mongoose;
global.mongoose.Promise = require('bluebird');
global.models = {};
global.sms = require('./utils/sms');
///////////////////////////////////////////////
app.use(compression());
app.use(
  cors({
    maxAge: 604800000,
  }),
);

app.use(
  bodyParser.json({
    limit: '50mb',
    extended: true,
  }),
);

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }),
);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(processImageUpload.processImageUpload);

////////////RUNING HOOKS, REGISTRING ROUTES, GETTING MODELS, RUNINN TASKS////////////////
app.get('/version', (req, res) => {
  return res.status(200).json({
    time: new Date(),
    message: 'Working',
  });
});
Promise.resolve()
  .then(() => {
    return hooks.loadModules().then(() => {
      console.log('Modelos cargados:');
      console.log(global.models);
    });
  })
  .then(() => {
    ///////////////ErrorHandler////////////////
    errorHandler();
    /////////////////////////////////////////////////
  })
  .then(() => {
    // eslint-disable-next-line no-unused-vars
    app.route('/test').get(async (req, res, next) => {
      let data = await global.models.Message.find({});
      return res.status(200).json({
        data: data,
        total: data.length,
      });
    });
  })
  .then(() => {
    console.log('Entre en esta otra tarea');
  })
  .catch((err) => {
    console.log(err);
  });

///////////////////////////////////////////////////////////
async function errorHandler() {
  global.app.express.use((error, req, res, next) => {
    console.log('*********************************************');
    console.log('!!!!!!!!GLOBALLY ERROR HANDLER!!!!!!!!!', error);
    const status = error.statusCode || 500;
    const message = error.message;
    const errors = error.errors || [];
    return res.status(status).json({
      message: message,
      errors: errors,
    });
  });
}

///////////////START THE SERVER ON DATABASE CONNECTION/////////////////////////////
mongoDb
  .connect()
  .then(() => {
    console.log('Client Connected Succefully');
    let server = app.listen(process.env.PORT || PORT);
    require('./socket/socket').socketHandler(server);
    console.log(`App start at ${new Date().toTimeString()}`);
    console.log('The app start succefully');
    let io = require('./socket/socket').getSocketIO();
    io.emit('hello world', {
      data: 'hello',
    });
    // global.mongoose.set("debug", (collect, method, query, doc) => {
    //     console.log(`Collection: ${collect}, Method:${method}, Query: ${JSON.stringify(query)}`);
    // })
  })
  .catch((error) => {
    console.log('******************ERROR CONECTION MONGOOSE TO DB');
    console.log(error);
  });
