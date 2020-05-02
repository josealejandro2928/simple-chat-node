module.exports = async function (req, res, next) {
    let userFromId = req.loggedUser._id
    let userToId = req.query.userToId;
    if (!userToId) {
        return res.status(400).json({
            message: 'Invalid operation',
            errors: [{
                msg: 'You most provide a user to stablish a chat'
            }]
        })

    }

    console.log("Entre Aqui")

    try {
        let simpleChat = await global.models.SimpleChat.findOne({
            users: {
                $all: [userFromId, userToId]
            }
        })

        if (!simpleChat) {
            let newSimpleChat = new global.models.SimpleChat({
                users: [userFromId, userToId],
                messages: [],
                lastMessages: [],
            })
            let chat = await newSimpleChat.save();
            return res.status(200).json({
                messages: [],
                simpleChat: chat,
                lastMessage: undefined
            })
        }
        //////////////////////////////Si existe ya el Chat entre esos dos usuarios///////////////////////////
        let messages = await global.models.Message.find({
            simpleChat: simpleChat
        })

        messages = messages.map(item => {
            let messageX = item.toObject();
            messageX.action = (item.userFrom.toString() == userFromId.toString()) ? 'send' : 'received';
            return messageX;
        })

        let lastMessage = messages[messages.length - 1];

        return res.status(200).json({
            messages: messages,
            simpleChat: simpleChat,
            lastMessage: lastMessage
        })

    } catch (err) {
        return next(err);
    }


}