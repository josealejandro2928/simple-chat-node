const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
global.environment = env;
console.log('******Running on environment: *********', env);
const config = require(`${__dirname}/../config/config`)[env];
global.config = config


async function connect() {
    const url = config.database.url + config.database.name;
    console.log("connect -> url", url)
    return mongoose.connect(url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(response => {
        return response;
    })
}

module.exports = {
    connect
}