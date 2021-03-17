module.exports = function loadModels() {
    global.models['SimpleChat'] = require('./simple-chat');
    global.models['Message'] = require('./message');
}