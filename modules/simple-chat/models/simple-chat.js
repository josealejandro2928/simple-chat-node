const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SimpleChatShema = new Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    chatTo: {
        type: Schema.Types.ObjectId,
        ref: 'SimpleChat',
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: []
    }],
    lastMessageSendOrRead: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('SimpleChat', SimpleChatShema)