module.exports = function loadModels() {
    global.models['User'] = require('./user');
    global.models['Pin'] = require('./pin');
}