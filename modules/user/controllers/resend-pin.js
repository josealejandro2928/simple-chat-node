const valResult = require('express-validator').validationResult;

module.exports = async function resendPin(req, res, next) {
    const errors = valResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validations fails, entered data is incorrect',
            errors: errors.array()
        })
    }

    let userId = req.body.userId;
    let email = req.body.email;
    try {
        let user = await global.models.User.findOne({
            email: email,
            _id: userId
        })

        if (!user) {
            let error = new Error('There is not any user with this email');
            error.statusCode = 400;
            return next(error);
        }

        await global.models.Pin.deleteMany({
            user: user
        })

        let pin = Date.now() % 100000;
        let expiredAt = Date.now() + 3600000;
        new global.models.Pin({
            user: user,
            pin: pin,
            expiredAt
        }).save().then(pin => {
            sendEmail(user, pin)
            return res.sendStatus(204);
        });
    } catch (err) {
        return next(err);
    }

}

function sendEmail(user, pin) {
    global.mailer.transporter.sendMail({
        to: user.email,
        from: global.mailer.emailAddress,
        subject: "Sign Up Succssefully",
        html: `<h1 style="text-align:center;"> WELCOME ${user.name}</h1>
               <p1 style="text-align:center;"> Hello welcom to Simple-Char, use this code to activate your account <strong>${pin.pin}</strong></p1>`
    }).catch(err => {
        console.log(err)
    })
}