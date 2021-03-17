module.exports = async function listMessages(req, res, next) {
    try {
        let chat = req.chat;
        let messageId = req.query.messageId;
        let action = req.query.action;
        let limit = +req.query.limit || 10;
        let messages = [];
        if (action == 'backward') {
            /*
            Backward pagination
            */
            messages = await global.models.Message.find({
                simpleChat: chat,
                _id: {
                    $lt: messageId
                }
            }, ).limit(limit).sort({
                _id: -1
            });
            messages = messages.sort(compareId);
            return res.status(200).json({
                messages: messages,
                backwardFirstMessage: messages[0],
                action: 'backward'
            })

        } else {
            /*
            Forward pagination
            */
            messages = await global.models.Message.find({
                simpleChat: chat,
                _id: {
                    $gt: messageId
                }
            }, ).limit(limit).sort({
                _id: 1
            });
            return res.status(200).json({
                messages: messages,
                forwardLastMessage: messages[Math.max(messages.length - 1, 0)],
                action: 'forward'
            })
        }

    } catch (err) {
        return next(err);
    }
}

function compareId(a, b) {
    if (a._id.toString() > b._id.toString()) {
        return 1;
    }
    if (a._id.toString() < b._id.toString()) {
        return -1;
    } else {
        return 0;
    }
}