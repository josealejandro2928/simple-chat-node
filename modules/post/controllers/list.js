module.exports = function (req, res) {
    return res.status(200).json({
        data: [{
            _id: '1',
            title: 'POst #1',
            content: 'The loremn Insum',
            imageUrl: null,
            creator: {
                name: 'Jose Alejandro'
            },
            createdAt: new Date()
        }],
        totalPosts: 1
    })
}