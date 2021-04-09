const valResult = require('express-validator').validationResult;

module.exports = async function signUp(req, res, next) {
  const errors = valResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validations fails, entered data is incorrect',
      errors: errors.array(),
    });
  }

  let email = req.body.email;
  let name = req.body.name;

  let searchUser = await global.models.User.findOne({
    email: email,
  });
  if (!searchUser) {
    let newUser = new global.models.User({
      name,
      email,
      lastConnection: new Date(),
    });

    return newUser
      .save()
      .then(async (user) => {
        let pin = Date.now() % 100000;
        let expiredAt = Date.now() + 3600000;
        return new global.models.Pin({
          user: user,
          pin: pin,
          expiredAt,
        })
          .save()
          .then((pin) => {
            sendEmail(user, pin);
            return res.status(200).json({
              data: user,
            });
          });
      })
      .catch((error) => {
        return next(error);
      });
  } else {
    await global.models.Pin.deleteMany({
      user: searchUser,
    });
    let pin = Date.now() % 1000000;
    let expiredAt = Date.now() + 3600000;
    new global.models.Pin({
      user: searchUser,
      pin: pin,
      expiredAt,
    })
      .save()
      .then((pin) => {
        sendEmail(searchUser, pin);
        console.log('🚀 ~ file: signup.js ~ line 55 ~ signUp ~ pin', pin);
        return res.status(200).json({
          data: searchUser,
        });
      });
  }
};

function sendEmail(user, pin) {
  global.mailer.transporter
    .sendMail({
      to: user.email,
      from: global.mailer.emailAddress,
      subject: 'Sign Up Succssefully',
      html: `<h1 style="text-align:center;"> WELCOME ${user.name}</h1>
               <p1 style="text-align:center;"> Hello welcom to Simple-Char, use this code to activate your account <strong>${pin.pin}</strong></p1>`,
    })
    .catch((err) => {
      console.log(err);
    });
}
