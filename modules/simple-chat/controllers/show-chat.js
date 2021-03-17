module.exports = async function showChat(req, res, next) {
    try {

        let chatA = req.chat;
        let lastMessageSendOrRead = chatA.lastMessageSendOrRead;
        let messages = [];
        let notReadMessages = 0;
        if (lastMessageSendOrRead) {
            let lastMessages = await global.models.Message.find({
                simpleChat: chatA,
                _id: {
                    $lte: lastMessageSendOrRead
                }
            }, ).limit(10).sort({
                _id: -1
            })
            lastMessages = lastMessages.reverse();
            messages = lastMessages.concat(messages);
            let nextMessages = await global.models.Message.find({
                simpleChat: chatA,
                _id: {
                    $gt: lastMessageSendOrRead,
                },
            })
            messages = lastMessages.concat(nextMessages);

            notReadMessages = await global.models.Message.countDocuments({
                simpleChat: chatA,
                _id: {
                    $gt: lastMessageSendOrRead,
                },
                status: 'unread',
                action: "received"
            })
        } else {
            messages = await global.models.Message.find({
                simpleChat: chatA,
            })
            notReadMessages = messages.length;
        }

        global.models.SimpleChat.findById(chatA._id).populate('userTo').populate('userFrom').populate('lastMessage')
            .then((chat) => {
                return res.status(200).json({
                    messages: messages,
                    simpleChat: chat,
                    notReadMessages: notReadMessages
                })
            }).catch((err) => {
                return next(err);
            })

    } catch (err) {
        return next(err);
    }


}