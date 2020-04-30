module.exports = function (req, res, next) {

    const page = +req.query.page || 1;
    const itemPerPage = +req.query.itemsPerPage;
    let totalItems = 0;

    global.models.Post.find().countDocuments().then((total) => {
        totalItems = total;
        return global.models.Post.find().populate('creator').skip((page - 1) * itemPerPage).limit(itemPerPage);
    }).then((posts) => {
        return res.status(200).json({
            data: posts,
            totalItems: totalItems
        })
    }).catch(err => {
        return next(err);
    })
}