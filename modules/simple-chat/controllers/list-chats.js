module.exports = function listChats(req, res, next) {
    let limit = +req.query.limit || 10;
    let offset = +req.query.offset || 0;
    let userFromId = req.loggedUser._id
    global.models.SimpleChat.find({
            userFrom: userFromId
        }).skip(offset).limit(limit).sort({
            'updatedAt': -1
        }).populate('userTo').populate('userFrom').populate('lastMessage')
        .then((data) => {
            return global.mongoose.Promise.map(data, async (_chatX) => {
                let chatX = _chatX.toObject();
                if (chatX.lastMessageSendOrRead) {
                    chatX.notReadMessages = await global.models.Message.countDocuments({
                        simpleChat: chatX._id,
                        _id: {
                            $gt: chatX.lastMessageSendOrRead,
                        },
                        status: 'unread',
                        action: "received"
                    })
                } else {
                    chatX.notReadMessages = await global.models.Message.countDocuments({
                        simpleChat: chatX._id,
                        status: 'unread',
                        action: "received"
                    })

                }
                return chatX;
            }).then((fullData) => {
                req.data = fullData
            })
        }).then(() => {
            return global.models.SimpleChat.countDocuments({
                userFrom: userFromId
            })
        }).then(result => {
            return res.status(200).json({
                data: req.data,
                count: req.data.length,
                total: result
            })
        }).catch(err => {
            return next(err);
        })


}