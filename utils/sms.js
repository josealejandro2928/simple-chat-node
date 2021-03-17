var SID = global.config.sms.sid;
var token = global.config.sms.token;
const client = require('twilio')(SID, token);

module.exports = {
    sendSms(phone, msg) {
        return client.messages
            .create({
                body: msg,
                from: '+15154977972',
                to: phone
            })
    }
}