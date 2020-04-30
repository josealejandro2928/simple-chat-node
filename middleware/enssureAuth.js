const jwt = require('jsonwebtoken');

module.exports = function enssureAuth(req, res, next) {
    const Authorization = req.get('Authorization');
    if (!Authorization) {
        const error = new Error('Invalid Authentication');
        error.statusCode = 401;
        throw error;
    }
    let token = Authorization.split(' ')[1]
    let decodedToken;
    try {
        decodedToken = jwt.decode(token, global.config, global.config.jwtKey);
    } catch (err) {
        next(err);
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    global.models.User.findOne({
        _id: decodedToken.userId,
        email: decodedToken.email
    }, '-posts').then((user) => {
        if (!user) {
            let error = Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        req.loggedUser = user
        return next();
    }).catch(err => {
        return next(err);
    })

}