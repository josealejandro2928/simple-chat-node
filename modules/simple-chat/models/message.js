const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    simpleChat: {
        type: Schema.Types.ObjectId,
        ref: 'SimpleChat',
        required: true
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String
    },
    date: {
        type: Date,
        required: true
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
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Message', MessageSchema)