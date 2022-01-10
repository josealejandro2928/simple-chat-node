// const nodemailer = require('nodemailer');

// const config = {
//   enabled: true,
//   sendMail: false,
//   activeService: 'gmail',
//   from: 'jalejandro2928@gmail.com<jalejandro2928@gmail.com>',
//   services: {
//     gmail: {
//       service: 'gmail',
//       auth: {
//         user: 'jalejandro2928@gmail.com',
//         pass: '123456.Aa*',
//       },
//     },
//   },
// };

// var activeService = config.activeService;
// var options = config.services[activeService];
// // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// var transporter = nodemailer.createTransport(options);

// module.exports = transporter;

module.exports = async (to, subject = '', text = '', html = '') => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(global.config.mailKey);
  const msg = {
    to: to, // Change to your recipient
    from: 'jalejandroc2928@gmail.com', // Change to your verified sender
    subject: subject,
    text: text,
    html: html,
  };
  return sgMail.send(msg);
};
