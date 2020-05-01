module.exports = function getContacts(req, res, next) {
    let user = req.loggedUser;

    global.models.User.find({
        status: 'enabled',
        _id: {
            $ne: user._id
        }
    }).then((data) => {
        return res.status(200).json({
            data: data
        })
    }).catch(error => {
        next(error);
    })

}