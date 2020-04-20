module.exports = {
    getPost(req, res, next) {
        return res.status(200).json([{
            title: 'POst #1',
            message: 'The loremn Insum'
        }])
    },
    createPost(req, res, next) {
        console.log("createPost -> req", req.body)
        const title = req.body.title;
        const message = req.body.message;
        return res.status(201).json({
            title: title,
            message: message,
            id: new Date().toISOString()
        });

    }

}