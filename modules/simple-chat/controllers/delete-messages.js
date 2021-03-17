module.exports = async function deleteMessages(req, res, next) {
    let loggerUser = req.loggedUser;
    let chat = req.chat;
    let chatTo = await global.models.SimpleChat.findById(chat.chatTo);
    let messageIds = req.body.messageIds;

    global.mongoose.Promise.map(messageIds, async function (messageXId) {
        let messageX = await global.models.Message.findById(messageXId)
        await updateLastMessagesOfChat(chat, messageX);
        return global.models.Message.findOneAndDelete({
            _id: messageXId,
            simpleChat: chat._id,
        }).then(async () => {
            if (messageX.action == 'send') {
                let messageXTo = await global.models.Message.findOne({
                    simpleChat: chat.chatTo,
                    messageFromId: messageX._id
                })
                console.log("deleteMessages -> messageXFrom", messageXTo)
                if (messageXTo) {
                    await updateLastMessagesOfChat(chatTo, messageXTo);
                    return global.models.Message.deleteOne({
                        _id: messageXTo._id
                    })
                }


            }
        })
    }).then(() => {
        return res.sendStatus(204);
    }).catch((err) => {
        return next(err);
    })





}

async function updateLastMessagesOfChat(chat, message) {
    // console.log("updateLastMessagesOfChat -> message", message)
    if (chat.lastMessageSendOrRead && message && chat.lastMessageSendOrRead.toString() == message._id.toString()) {
        let newLastMessageSendOrRead = await global.models.Message.findOne({
            _id: {
                $lt: chat.lastMessageSendOrRead
            },
            simpleChat: chat._id
        }).sort({
            _id: -1
        })
        console.log("updateLastMessagesOfChat -> newLastMessageSendOrRead", newLastMessageSendOrRead)
        chat.lastMessageSendOrRead = (newLastMessageSendOrRead) ? newLastMessageSendOrRead._id : undefined;
        await chat.save();
    }
    if (chat.lastMessage && message && chat.lastMessage.toString() == message._id.toString()) {
        let newLastMessage = await global.models.Message.findOne({
            _id: {
                $lt: chat.lastMessage
            },
            simpleChat: chat._id
        }).sort({
            _id: -1
        })
        chat.lastMessage = (newLastMessage) ? newLastMessage._id : undefined;
        await chat.save();
    }
}