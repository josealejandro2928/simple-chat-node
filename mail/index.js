const nodemailer = require("nodemailer");

const config = {
    "enabled": true,
    "sendMail": false,
    "activeService": "gmail",
    "from": "jalejandro2928@gmail.com<jalejandro2928@gmail.com>",
    "services": {
        "gmail": {
            "service": "gmail",
            "auth": {
                "user": "pivotcuba@gmail.com",
                "pass": "pivotcuba1234"
            }
        }
    }
}

var activeService = config.activeService;
var options = config.services[activeService];
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var transporter = nodemailer.createTransport(options);

module.exports = transporter;