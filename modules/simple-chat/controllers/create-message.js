const soketIo = require('../../../socket/socket');
module.exports = async function (req, res, next) {
    let chatId = req.body.chatId;
    let userFromId = req.loggedUser._id;
    let message = req.body.message || '';

    try {
        let chatA = await global.models.SimpleChat.findById(chatId);
        let chatB = await global.models.SimpleChat.findOne({
            chatTo: chatA
        });

        if (!chatA) {
            let error = new Error('The chat does not Exist');
            error.statusCode = 404;
            throw error;
        }

        if (!chatB) {
            let error = new Error('The chat does not Exist');
            error.statusCode = 404;
            throw error;
        }

        let messageXA = new global.models.Message({
            simpleChat: chatA,
            date: new Date(),
            status: 'unread',
            creator: userFromId,
            message: message,
            action: 'send'
        })

        let messageXB = new global.models.Message({
            simpleChat: chatB,
            date: new Date(),
            status: 'unread',
            creator: userFromId,
            message: message,
            action: 'received',
        })

        messageXA.save().then(async (messageA) => {
            let socket = soketIo.getClient(chatA.userFrom);
            if (socket) {
                socket.emit('send-message', {
                    data: messageA,
                    action: 'Mensaje created'
                })
            }
            chatA.lastMessage = messageA._id;
            chatA.lastMessageSendOrRead = messageA._id;
            await chatA.save();
            req.messageA = messageA;
            return messageXB.save();
        }).then(async (messageB) => {
            let socket = soketIo.getClient(chatA.userTo);
            if (socket) {
                socket.emit('send-message', {
                    data: messageB,
                    action: 'Mensaje created'
                })
            }
            messageB.messageFromId = req.messageA._id;
            chatB.lastMessage = await messageB.save();
            await chatB.save()
            return res.sendStatus(204);
        }).catch((err) => {
            return next(err);
        })

    } catch (err) {
        return next(err);
    }






}