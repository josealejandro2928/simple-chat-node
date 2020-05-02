module.exports = function show(req, res, next) {
    return res.status(200).json({
        data: req.post
    })
}