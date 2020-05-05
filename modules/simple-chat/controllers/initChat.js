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
        let chatA = await global.models.SimpleChat.findOne({
            userFrom: userFromId,
            userTo: userToId
        });

        let chatB = await global.models.SimpleChat.findOne({
            userFrom: userToId,
            userTo: userFromId
        })

        if (!chatA || !chatB) {
            let newSimpleChatA = new global.models.SimpleChat({
                userFrom: userFromId,
                userTo: userToId,
                messages: [],
            })
            let newSimpleChatB = new global.models.SimpleChat({
                userFrom: userToId,
                userTo: userFromId,
                messages: [],
            })
            let _newChatB = await newSimpleChatB.save();
            let _newChatA = await newSimpleChatA.save();

            await global.models.SimpleChat.findOneAndUpdate({
                _id: _newChatB
            }, {
                chatTo: _newChatA
            })

            await global.models.SimpleChat.findOneAndUpdate({
                _id: _newChatA
            }, {
                chatTo: _newChatB
            })

            return global.models.SimpleChat.findById(_newChatA._id).populate('userTo')
                .populate('userFrom')
                .then((chat) => {
                    return res.status(200).json({
                        messages: [],
                        simpleChat: chat,
                    })
                })
        }
        //////////////////////////////Si existe ya el Chat entre esos dos usuarios///////////////////////////
        /////////////////Implementar lógica para devolver los mensajes //////////////////////////////////////
        /////////////////EL chatA es el requerido por el usuario logeado que hace la peticion///////////////
        let messages = await global.models.Message.find({
            simpleChat: chatA
        })
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        return global.models.SimpleChat.findById(chatA._id).populate('userTo')
            .populate('userFrom')
            .then((chat) => {
                return res.status(200).json({
                    messages: messages,
                    simpleChat: chat,
                })
            })
    } catch (err) {
        return next(err);
    }


}