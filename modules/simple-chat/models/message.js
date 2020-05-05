const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    simpleChat: {
        type: Schema.Types.ObjectId,
        ref: 'SimpleChat',
        required: true
    },
    message: {
        type: String
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['simple', 'response'],
        default: 'simple'
    },
    date: {
        type: Date,
        required: true
    },
    action: {
        type: String,
        enum: ['send', 'received']
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageFromId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Message', MessageSchema)